'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // migrations/create-jobs.js
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('Jobs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    budget: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    status: {
      type: Sequelize.ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'OPEN'
    },
    clientId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // This links the table at the DB level
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: { allowNull: false, type: Sequelize.DATE },
    updatedAt: { allowNull: false, type: Sequelize.DATE }
  });
}
};