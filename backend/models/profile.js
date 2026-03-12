'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  Profile.init({
    bio: DataTypes.TEXT,
    skills: DataTypes.STRING,
    hourlyRate: DataTypes.DECIMAL,
    portfolioUrl: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: 'URL to portfolio file or document'
    },
    category: {
      type: DataTypes.ENUM('WEB_DEV', 'MOBILE_DEV', 'DESIGN', 'WRITING', 'MARKETING', 'OTHER'),
      defaultValue: 'OTHER'
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};