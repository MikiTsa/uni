// src/models/FileTag.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FileTag = sequelize.define('FileTag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'file_tags',
    timestamps: false,
  });

  FileTag.associate = (models) => {
    FileTag.hasMany(models.File, { foreignKey: 'tag_id', as: 'files' });
  };

  return FileTag;
};