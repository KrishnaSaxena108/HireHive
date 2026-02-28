'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // migrations/create-users.js
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      // Professional Enum mapping
      type: Sequelize.ENUM('CLIENT', 'FREELANCER', 'ADMIN'),
      defaultValue: 'FREELANCER'
    },
    balance: {
      // 10 digits total, 2 after the decimal point
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    createdAt: { allowNull: false, type: Sequelize.DATE },
    updatedAt: { allowNull: false, type: Sequelize.DATE }
  });
}
};