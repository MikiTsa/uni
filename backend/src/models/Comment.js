// src/models/Comment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by', references: { model: 'users', key: 'id' } },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
    parentCommentId: { type: DataTypes.INTEGER, allowNull: true, field: 'parent_comment_id', references: { model: 'comments', key: 'id' } },
    fileId: { type: DataTypes.INTEGER, allowNull: true, field: 'file_id', references: { model: 'files', key: 'id' } },
  }, {
    tableName: 'comments',
    timestamps: false,
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User,    { foreignKey: 'created_by',        as: 'author' });
    Comment.belongsTo(models.File,    { foreignKey: 'file_id',           as: 'file' });
    Comment.belongsTo(models.Comment, { foreignKey: 'parent_comment_id', as: 'parent' });
    Comment.hasMany(models.Comment,   { foreignKey: 'parent_comment_id', as: 'replies' });
  };

  return Comment;
};