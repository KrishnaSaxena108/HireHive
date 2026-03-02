'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     this.belongsTo(models.Job, { 
      foreignKey: 'jobId', 
      as: 'job' 
    });

    // 2. Connect Proposal to the Freelancer (User)
    this.belongsTo(models.User, { 
      foreignKey: 'freelancerId', 
      as: 'freelancer' 
    });
    }
  }
  Proposal.init({
    coverLetter: DataTypes.TEXT,
    bidAmount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    jobId: DataTypes.INTEGER,
    freelancerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Proposal',
  });
  return Proposal;
};