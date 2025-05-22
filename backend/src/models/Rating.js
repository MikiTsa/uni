// src/models/Rating.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.ENUM('like','dislike'), allowNull: false },
    createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by', references: { model: 'users', key: 'id' } },
    fileId: { type: DataTypes.INTEGER, allowNull: false, field: 'file_id', references: { model: 'files', key: 'id' } },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  }, {
    tableName: 'ratings',
    timestamps: false,
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: 'created_by', as: 'user' });
    Rating.belongsTo(models.File, { foreignKey: 'file_id',    as: 'file' });
  };

  return Rating;
};