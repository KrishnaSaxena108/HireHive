'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'reviewerId',
        as: 'reviewer'
      });
      this.belongsTo(models.User, {
        foreignKey: 'revieweeId',
        as: 'reviewee'
      });
      this.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'job'
      });
    }
  }
  Review.init({
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    reviewerId: DataTypes.INTEGER,
    revieweeId: DataTypes.INTEGER,
    jobId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};