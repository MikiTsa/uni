// src/models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profilePicturePath: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'profile_picture_path',
    },
    trustScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'trust_score',
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'trusted'),
      allowNull: false,
      defaultValue: 'user',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.File, { foreignKey: 'created_by', as: 'files' });
    User.hasMany(models.Rating, { foreignKey: 'created_by', as: 'ratings' });
    User.hasMany(models.FileReport, { foreignKey: 'created_by', as: 'reports' });
    User.hasMany(models.Comment, { foreignKey: 'created_by', as: 'comments' });
  };

  return User;
};