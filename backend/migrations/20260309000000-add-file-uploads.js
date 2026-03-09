'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add profilePictureUrl to Users table
    await queryInterface.addColumn('Users', 'profilePictureUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      comment: 'URL to user profile picture'
    });

    // Add portfolioUrl to Profiles table
    await queryInterface.addColumn('Profiles', 'portfolioUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      comment: 'URL to portfolio file or document'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove profilePictureUrl from Users table
    await queryInterface.removeColumn('Users', 'profilePictureUrl');

    // Remove portfolioUrl from Profiles table
    await queryInterface.removeColumn('Profiles', 'portfolioUrl');
  }
};
