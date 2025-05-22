// src/models/Subject.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subject = sequelize.define('Subject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    studyProgramYearId: { type: DataTypes.INTEGER, allowNull: false, field: 'study_programs_year_id', references: { model: 'study_programs_year', key: 'id' } },
  }, {
    tableName: 'subjects',
    timestamps: false,
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.StudyProgramYear, { foreignKey: 'study_programs_year_id', as: 'year' });
    Subject.hasMany(models.File,               { foreignKey: 'subject_id', as: 'files' });
  };

  return Subject;
};