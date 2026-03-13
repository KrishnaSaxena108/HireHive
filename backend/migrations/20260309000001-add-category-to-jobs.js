'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Jobs', 'category', {
      type: Sequelize.ENUM('WEB_DEV', 'MOBILE_DEV', 'DESIGN', 'WRITING', 'MARKETING', 'OTHER'),
      defaultValue: 'OTHER',
      allowNull: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Jobs', 'category');
  }
};
