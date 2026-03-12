'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Jobs', 'deliverableUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      comment: 'Google Drive URL for the completed project deliverable'
    });
    await queryInterface.addColumn('Jobs', 'deliverableFileName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      comment: 'Original filename of the deliverable'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Jobs', 'deliverableUrl');
    await queryInterface.removeColumn('Jobs', 'deliverableFileName');
  }
};
