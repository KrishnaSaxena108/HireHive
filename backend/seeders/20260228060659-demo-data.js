'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash passwords
    const clientPassword = await bcrypt.hash('hashed_password_123', 10);
    const adminPassword = await bcrypt.hash('Ak@462005', 10);

    // 1. Create a demo Client
    await queryInterface.bulkInsert('Users', [{
      username: 'anshu_dev',
      email: 'anshu@hirehive.com',
      password: clientPassword,
      role: 'CLIENT',
      balance: 1000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Get the actual client user ID
    const [clients] = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE email = 'anshu@hirehive.com' LIMIT 1"
    );
    const clientId = clients[0].id;

    // 2. Create an Admin user
    await queryInterface.bulkInsert('Users', [{
      username: 'admin_akshit',
      email: 'akshitverma462005@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      balance: 0.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 3. Create a Job linked to that Client
    await queryInterface.bulkInsert('Jobs', [{
      title: 'Develop HireHive Backend',
      description: 'Need a senior dev to implement GraphQL and Sequelize',
      budget: 500.00,
      status: 'OPEN',
      clientId: clientId, 
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jobs', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};