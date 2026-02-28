'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Create a demo Client
    await queryInterface.bulkInsert('Users', [{
      username: 'anshu_dev',
      email: 'anshu@hirehive.com',
      password: 'hashed_password_123', // We'll add real hashing later
      role: 'CLIENT',
      balance: 1000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 2. Create a Job linked to that Client (ID 1)
    await queryInterface.bulkInsert('Jobs', [{
      title: 'Develop HireHive Backend',
      description: 'Need a senior dev to implement GraphQL and Sequelize',
      budget: 500.00,
      status: 'OPEN',
      clientId: 1, 
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jobs', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};