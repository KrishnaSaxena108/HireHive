const { User, Job, Proposal, Message, Profile, Notification, Review, sequelize } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const resolvers = {
  Query: {
    users: async () => await User.findAll({ include: ['postedJobs', 'profile'] }),
    me: async (_, __, { user }) => {
      if (!user) return null;
      return await User.findByPk(user.id, { include: ['postedJobs','profile'] });
    },
    jobs: async () => await Job.findAll({ include: ['client', 'proposals'] }),
    job: async (_, { id }) => await Job.findByPk(id, { include: ['client', 'proposals'] }),
    
    myProposals: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await Proposal.findAll({ where: { freelancerId: user.id }, include: ['job'] });
    },
    searchFreelancers: async (_, { query, category }) => {
  const whereClause = { role: 'FREELANCER' };
  
  // Advanced search across Username and Profile bio/skills
  return await User.findAll({
    where: whereClause,
    include: [{
      model: Profile,
      as: 'profile',
      where: {
        [Op.or]: [
          { skills: { [Op.like]: `%${query}%` } },
          { bio: { [Op.like]: `%${query}%` } },
          category ? { category: category } : {}
        ]
      }
    }]
  });
},
    notifications: async (_, { userId }) => {
      return await Notification.findAll({ where: { userId }, order: [['createdAt','DESC']] });
    },
    reviewsByUser: async (_, { userId }) => {
      return await Review.findAll({
        where: { revieweeId: userId },
        include: ['reviewer','job']
      });
    },
    reviewsByJob: async (_, { jobId }) => {
      return await Review.findAll({
        where: { jobId },
        include: ['reviewer','reviewee']
      });
    },
    jobsByCategory: async (_, { category }) => {
      return await Job.findAll({
        where: { category, status: 'OPEN' },
        include: ['client', 'proposals']
      });
    },
    searchJobs: async (_, { keyword, category, minBudget, maxBudget, status }) => {
      const whereClause = {};
      
      // keyword search in title and description
      if (keyword) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } }
        ];
      }
      
      // category filter
      if (category) whereClause.category = category;
      
      // status filter
      if (status) whereClause.status = status;
      
      // budget range filter
      if (minBudget !== null && minBudget !== undefined) {
        whereClause.budget = whereClause.budget || {};
        whereClause.budget[Op.gte] = minBudget;
      }
      if (maxBudget !== null && maxBudget !== undefined) {
        whereClause.budget = whereClause.budget || {};
        whereClause.budget[Op.lte] = maxBudget;
      }
      
      return await Job.findAll({
        where: whereClause,
        include: ['client', 'proposals'],
        limit: 50,
        order: [['createdAt', 'DESC']]
      });
    },

    // --- Admin Queries ---
    adminUsers: async (_, __, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      return await User.findAll({ include: ['postedJobs', 'profile'] });
    },
    adminJobs: async (_, __, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      return await Job.findAll({ include: ['client', 'proposals'] });
    },
    adminProposals: async (_, __, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      return await Proposal.findAll({ include: ['job', 'freelancer'] });
    },
    adminStats: async (_, __, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      
      const [totalUsers, totalJobs, totalProposals, activeJobs, completedJobs] = await Promise.all([
        User.count(),
        Job.count(),
        Proposal.count(),
        Job.count({ where: { status: 'OPEN' } }),
        Job.count({ where: { status: 'COMPLETED' } })
      ]);

      return {
        totalUsers,
        totalJobs,
        totalProposals,
        activeJobs,
        completedJobs
      };
    },
  },

  Mutation: {
    // --- AUTHENTICATION ---
    register: async (_, { username, email, password, role }, { io }) => {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword, role });
      io.emit('notification', { message: `Welcome our newest ${role.toLowerCase()}, ${username}!` });
      // persist welcome notification for this user
      await Notification.create({
        userId: user.id,
        message: `Welcome, ${username}! Your account has been created.`,
        isRead: false
      });
      const token = generateToken(user);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");
      const token = generateToken(user);
      return { token, user };
    },
    markNotificationRead: async (_, { id }) => {
      const notif = await Notification.findByPk(id);
      if (!notif) throw new Error("Notification not found");
      await notif.update({ isRead: true });
      return notif;
    },

    // --- JOB MANAGEMENT (#16) ---
    createJob: async (_, { title, description, budget, category }, { io, user }) => {
      if (!user) throw new Error("Unauthorized");
      const job = await Job.create({ 
        title, 
        description, 
        budget, 
        category: category || 'OTHER',
        clientId: user.id, 
        status: 'OPEN' 
      });
      io.emit('job_created', job);
      // persist notification to client
      await Notification.create({
        userId: user.id,
        message: `Your job "${title}" in ${category || 'OTHER'} is now live.`,
        isRead: false
      });
      return job;
    },

    // --- PROPOSAL & HIRING (#11 & #18) ---
    submitProposal: async (_, { jobId, coverLetter, bidAmount }, { io, user }) => {
      if (!user || user.role !== 'FREELANCER') throw new Error("Only freelancers can bid");
      const proposal = await Proposal.create({
        jobId, coverLetter, bidAmount, freelancerId: user.id, status: 'PENDING'
      });
      const job = await Job.findByPk(jobId);
      io.to(`user_${job.clientId}`).emit('new_proposal', { jobId, proposalId: proposal.id });
      // persist notification to job's client
      await Notification.create({
        userId: job.clientId,
        message: `You have a new proposal for your job "${job.title}".`,
        isRead: false
      });
      return proposal;
    },

    acceptProposal: async (_, { proposalId }, { io, user }) => {
      if (!user || user.role !== 'CLIENT') throw new Error("Only clients can hire");

      // Use a Transaction to ensure all or nothing updates
      const result = await sequelize.transaction(async (t) => {
        const proposal = await Proposal.findByPk(proposalId, { transaction: t });
        if (!proposal) throw new Error("Proposal not found");

        // 1. Accept this proposal
        await proposal.update({ status: 'ACCEPTED' }, { transaction: t });

        // 2. Close the job
        const job = await Job.findByPk(proposal.jobId, { transaction: t });
        await job.update({ status: 'IN_PROGRESS' }, { transaction: t });

        // 3. Reject other proposals for this job
        await Proposal.update(
          { status: 'REJECTED' },
          { where: { jobId: job.id, id: { [Op.ne]: proposalId } }, transaction: t }
        );

        // Notify Freelancer via Socket
        io.to(`user_${proposal.freelancerId}`).emit('proposal_accepted', { jobId: job.id });
        // persist notification for freelancer
        await Notification.create({
          userId: proposal.freelancerId,
          message: `Your proposal for "${job.title}" was accepted!`,
          isRead: false
        });

        return proposal;
      });
      return result;
    },

    // --- CHAT & PROFILES (#20 & #10) ---
    sendMessage: async (_, { receiverId, content, jobId }, { io, user }) => {
      if (!user) throw new Error("Unauthorized");
      const message = await Message.create({ content, senderId: user.id, receiverId, jobId });
      io.to(`user_${receiverId}`).emit('receive_message', message);
      // persist notification for receiver
      await Notification.create({
        userId: receiverId,
        message: `New message from ${user.username}.`,
        isRead: false
      });
      return message;
    },

    updateProfile: async (_, { bio, skills, hourlyRate }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const [profile, created] = await Profile.findOrCreate({
        where: { userId: user.id },
        defaults: { bio, skills, hourlyRate }
      });
      if (!created) {
        await profile.update({ bio, skills, hourlyRate });
      }
      return profile;
    },
    // --- Reviews & Ratings ---
    submitReview: async (_, { revieweeId, jobId, rating, comment }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      if (user.id === parseInt(revieweeId)) throw new Error("Cannot review yourself");
      const job = await Job.findByPk(jobId);
      if (!job) throw new Error("Job not found");
      const existing = await Review.findOne({ where: { reviewerId: user.id, jobId } });
      if (existing) throw new Error("Already reviewed this job");
      const review = await Review.create({
        rating, comment, reviewerId: user.id, revieweeId, jobId
      });
      return review;
    },

    // --- Contact Form ---
    submitContactForm: async (_, { name, email, message }) => {
      // In a real application, you might want to save this to a database or send an email
      console.log(`Contact form submission from ${name} (${email}): ${message}`);
      return {
        id: Date.now().toString(),
        name,
        email,
        message
      };
    },

    // --- Admin Mutations ---
    suspendUser: async (_, { userId }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      const targetUser = await User.findByPk(userId);
      if (!targetUser) throw new Error("User not found");
      if (targetUser.role === 'ADMIN') throw new Error("Cannot suspend admin users");
      
      await targetUser.update({ role: 'SUSPENDED' });
      return targetUser;
    },
    activateUser: async (_, { userId }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      const targetUser = await User.findByPk(userId);
      if (!targetUser) throw new Error("User not found");
      
      await targetUser.update({ role: 'FREELANCER' }); // Default to freelancer
      return targetUser;
    },
    deleteJob: async (_, { jobId }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      const job = await Job.findByPk(jobId);
      if (!job) throw new Error("Job not found");
      
      await job.destroy();
      return true;
    },
    deleteProposal: async (_, { proposalId }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Admin access required");
      const proposal = await Proposal.findByPk(proposalId);
      if (!proposal) throw new Error("Proposal not found");
      
      await proposal.destroy();
      return true;
    }
  },
};

// Field-level resolver for computed values
resolvers.User = {
  averageRating: async (parent) => {
    const reviews = await Review.findAll({ where: { revieweeId: parent.id } });
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }
};

module.exports = resolvers;