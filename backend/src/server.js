const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const db = require('../models');

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

  // Context: Extract User from JWT for every request
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