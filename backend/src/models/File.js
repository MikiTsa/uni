// src/models/File.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const File = sequelize.define('File', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    path: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
    createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by', references: { model: 'users', key: 'id' } },
    tagId: { type: DataTypes.INTEGER, allowNull: true, field: 'tag_id', references: { model: 'file_tags', key: 'id' } },
    subjectId: { type: DataTypes.INTEGER, allowNull: true, field: 'subject_id', references: { model: 'subjects', key: 'id' } },
  }, {
    tableName: 'files',
    timestamps: false,
  });

  File.associate = (models) => {
    File.belongsTo(models.User,      { foreignKey: 'created_by', as: 'creator' });
    File.belongsTo(models.FileTag,   { foreignKey: 'tag_id',     as: 'tag' });
    File.belongsTo(models.Subject,   { foreignKey: 'subject_id', as: 'subject' });
    File.hasMany(models.FileReport,  { foreignKey: 'file_id',    as: 'reports' });
    File.hasMany(models.Rating,      { foreignKey: 'file_id',    as: 'ratings' });
    File.hasMany(models.Comment,     { foreignKey: 'file_id',    as: 'comments' });
  };

  return File;
};