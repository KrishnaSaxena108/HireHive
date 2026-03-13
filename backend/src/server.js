const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const db = require('../models');
const cloudinary = require('cloudinary').v2;

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for deliverables
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/webp', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/vnd.rar'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: images, PDF, DOC, DOCX, ZIP, RAR.'));
    }
  }
});

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('Cloudinary configured successfully');
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(cors());
  app.use(express.json());
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadDir));

  // Authorization middleware for file uploads
  const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  const getLocalUploadUrl = (filename) => {
    return `${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${filename}`;
  };

  const runCloudinaryUpload = (method, filePath, options) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader[method](filePath, options, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  };

  // Use chunked uploads for larger raw files and fall back to local storage if cloud upload fails.
  const uploadToCloud = async (file, folder, options = {}) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return getLocalUploadUrl(file.filename);
    }

    const uploadOptions = {
      folder,
      resource_type: options.resourceType || 'auto',
      use_filename: true,
      unique_filename: true,
      timeout: options.timeout || 120000
    };

    try {
      const shouldUseLargeUpload = options.useLargeUpload || file.size > (options.largeUploadThreshold || 8 * 1024 * 1024);
      const method = shouldUseLargeUpload ? 'upload_large' : 'upload';
      const result = await runCloudinaryUpload(method, file.path, shouldUseLargeUpload
        ? {
            ...uploadOptions,
            chunk_size: options.chunkSize || 6 * 1024 * 1024
          }
        : uploadOptions);

      const uploadedUrl = result?.secure_url || result?.url;
      if (!uploadedUrl) {
        throw new Error('Cloudinary did not return an upload URL');
      }

      return uploadedUrl;
    } catch (error) {
      console.error('Cloudinary upload failed, using local storage:', error.message || error);
      return getLocalUploadUrl(file.filename);
    }
  };

  // File Upload Endpoint for Profile Picture
  app.post('/api/upload/profile-picture', authRequired, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = await uploadToCloud(req.file, 'hirehive/profile-pictures', {
        resourceType: 'image'
      });
      
      // Update user profile picture
      await db.User.update(
        { profilePictureUrl: fileUrl },
        { where: { id: req.user.id } }
      );

      res.json({ success: true, fileUrl, message: 'Profile picture uploaded successfully' });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // File Upload Endpoint for Portfolio
  app.post('/api/upload/portfolio', authRequired, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = await uploadToCloud(req.file, 'hirehive/portfolios', {
        resourceType: 'auto',
        largeUploadThreshold: 15 * 1024 * 1024,
        timeout: 180000
      });
      
      // Update or create user profile with portfolio URL
      const [profile] = await db.Profile.findOrCreate({
        where: { userId: req.user.id },
        defaults: { userId: req.user.id, portfolioUrl: fileUrl }
      });
      await profile.update({ portfolioUrl: fileUrl });

      res.json({ success: true, fileUrl, message: 'Portfolio file uploaded successfully' });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // File Upload Endpoint for Project Deliverables
  app.post('/api/upload/deliverable', authRequired, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { jobId } = req.body;
      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }

      // Verify the freelancer is working on this job
      const proposal = await db.Proposal.findOne({
        where: { 
          freelancerId: req.user.id, 
          jobId: jobId,
          status: 'ACCEPTED'
        }
      });

      if (!proposal) {
        return res.status(403).json({ error: 'You are not assigned to this job' });
      }

      const job = await db.Job.findByPk(jobId);
      if (!job || job.status !== 'IN_PROGRESS') {
        return res.status(400).json({ error: 'Job is not in progress' });
      }

      let deliverableUrl;
      let deliverableFileName = req.file.originalname;

      deliverableUrl = await uploadToCloud(req.file, 'hirehive/deliverables', {
        resourceType: 'auto',
        largeUploadThreshold: 15 * 1024 * 1024,
        timeout: 180000
      });
      console.log('Deliverable uploaded:', deliverableUrl);

      res.json({ 
        success: true, 
        deliverableUrl, 
        deliverableFileName,
        message: 'Deliverable uploaded successfully' 
      });
    } catch (error) {
      console.error('Deliverable upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Error handling middleware for multer errors
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({ error: 'File size exceeds 50MB limit' });
      }
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err && err.message && req.path.startsWith('/api/upload/')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  });

  // Fallback 404 for /api routes
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });


  // --- FIXED CONTEXT BLOCK ---
  app.use('/graphql', expressMiddleware(server, {
   // server.js update
context: async ({ req }) => {
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.log("JWT Verification Error:", e.message);
    }
  }

  // Ensure io and user are passed to resolvers
  return { io, user };
},
  }));
  // Socket.io: Feature #20 & #22 (Private Messaging & Notifications)
  io.on('connection', (socket) => {
    // When a user connects, we put them in a private room named 'user_ID'
    socket.on('register_private_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their private notification room.`);
    });

    socket.on('disconnect', () => console.log('Client Disconnected'));
  });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 HireHive Backend: http://localhost:${PORT}/graphql`);
  });
}

startServer();