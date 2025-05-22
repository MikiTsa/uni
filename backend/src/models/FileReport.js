// src/models/FileReport.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FileReport = sequelize.define('FileReport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fileId: { type: DataTypes.INTEGER, allowNull: false, field: 'file_id', references: { model: 'files', key: 'id' } },
    createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by', references: { model: 'users', key: 'id' } },
    reason: { type: DataTypes.ENUM('unsafe','inappropriate','useless','misleading','inaccurate','corrupted','other'), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  }, {
    tableName: 'file_reports',
    timestamps: false,
  });

  FileReport.associate = (models) => {
    FileReport.belongsTo(models.File, { foreignKey: 'file_id',    as: 'file' });
    FileReport.belongsTo(models.User, { foreignKey: 'created_by', as: 'reporter' });
  };

  return FileReport;
};