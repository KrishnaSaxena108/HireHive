'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A Client (User) can post many Jobs
      this.hasMany(models.Job, { 
        foreignKey: 'clientId', 
        as: 'postedJobs',
        onDelete: 'CASCADE' 
      });
      // A User has one Profile
      this.hasOne(models.Profile, { foreignKey: 'userId', as: 'profile' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('CLIENT', 'FREELANCER', 'ADMIN'),
      defaultValue: 'FREELANCER'
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};