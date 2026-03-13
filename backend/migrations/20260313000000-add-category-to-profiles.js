'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Profiles', 'category', {
      type: Sequelize.ENUM('WEB_DEV', 'MOBILE_DEV', 'DESIGN', 'WRITING', 'MARKETING', 'OTHER'),
      allowNull: true,
      defaultValue: 'OTHER',
      comment: 'Freelancer specialty category'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Profiles', 'category');
  }
};
