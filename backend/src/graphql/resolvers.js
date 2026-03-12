const { User, Job, Proposal, Message, Profile, sequelize } = require('../../models');
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
    jobs: async () => await Job.findAll({ include: ['client', 'proposals'] }),
    job: async (_, { id }) => await Job.findByPk(id, { include: ['client', 'proposals'] }),

    myProposals: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await Proposal.findAll({ where: { freelancerId: user.id }, include: ['job'] });
    },

    freelancerProposals: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await Proposal.findAll({ where: { freelancerId: user.id }, include: ['job'] });
    },

    messages: async (_, { receiverId }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: user.id, receiverId: receiverId },
            { senderId: receiverId, receiverId: user.id },
          ],
        },
        include: [
          { model: User, as: 'sender' },
          { model: User, as: 'receiver' },
        ],
        order: [['createdAt', 'ASC']],
      });
    },

    searchFreelancers: async (_, { query, category }) => {
      const profileWhere = {};
      if (query) {
        profileWhere[Op.or] = [
          { skills: { [Op.like]: `%${query}%` } },
          { bio: { [Op.like]: `%${query}%` } },
        ];
      }
      return await User.findAll({
        where: { role: 'FREELANCER' },
        include: [{ model: Profile, as: 'profile', where: Object.keys(profileWhere).length ? profileWhere : undefined }],
      });
    },

    popularCategories: async () => {
      return ['Web Development', 'Graphic Design', 'Content Writing', 'Mobile Apps', 'Data Science', 'SEO & Marketing'];
    },
  },

  Mutation: {
    // --- AUTHENTICATION ---
    register: async (_, { username, email, password, role }, { io }) => {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword, role });
      io.emit('notification', { message: `Welcome our newest ${role.toLowerCase()}, ${username}!` });
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

    // --- JOB MANAGEMENT (#16) ---
    createJob: async (_, { title, description, budget }, { io, user }) => {
      if (!user) throw new Error("Unauthorized");
      const job = await Job.create({ title, description, budget, clientId: user.id, status: 'OPEN' });
      io.emit('job_created', job);
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

        return proposal;
      });
      return result;
    },

    // --- CHAT & PROFILES (#20 & #10) ---
    sendMessage: async (_, { receiverId, content, jobId }, { io, user }) => {
      if (!user) throw new Error("Unauthorized");
      const message = await Message.create({ content, senderId: user.id, receiverId, jobId });
      io.to(`user_${receiverId}`).emit('receive_message', message);
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

    submitContactForm: async (_, { name, email, message }) => {
      return { id: Date.now().toString(), name, email, message };
    },
  },

  Message: {
    sender: async (message) => {
      if (message.sender) return message.sender;
      return await User.findByPk(message.senderId);
    },
    receiver: async (message) => {
      if (message.receiver) return message.receiver;
      return await User.findByPk(message.receiverId);
    },
  },
};

module.exports = resolvers;