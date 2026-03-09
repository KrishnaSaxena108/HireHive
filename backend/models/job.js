'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      // A Job always belongs to a Client
      this.belongsTo(models.User, { 
        foreignKey: 'clientId', 
        as: 'client' 
      });
      this.hasMany(models.Proposal, { 
      foreignKey: 'jobId', 
      as: 'proposals' 
    });
      this.hasMany(models.Review, {
        foreignKey: 'jobId',
        as: 'reviews'
      });
    }
  }
  Job.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'OPEN'
    },
    category: {
      type: DataTypes.ENUM('WEB_DEV', 'MOBILE_DEV', 'DESIGN', 'WRITING', 'MARKETING', 'OTHER'),
      defaultValue: 'OTHER'
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Job',
  });
  return Job;
};