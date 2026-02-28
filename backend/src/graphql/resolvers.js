const { User, Job } = require('../../models');

const resolvers = {
  Query: {
    users: async () => await User.findAll({ include: 'postedJobs' }),
    jobs: async () => await Job.findAll({ include: 'client' }),
    job: async (_, { id }) => await Job.findByPk(id, { include: 'client' }),
  },
  Mutation: {
    createJob: async (_, { title, description, budget, clientId }) => {
      return await Job.create({ title, description, budget, clientId });
    },
  },
};

module.exports = resolvers;