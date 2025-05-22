// src/models/StudyProgramYear.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudyProgramYear = sequelize.define('StudyProgramYear', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    year: { type: DataTypes.INTEGER, allowNull: false },
    degreeLevel: { type: DataTypes.ENUM('undergraduate','master','PhD','other'), allowNull: false, field: 'degree_level' },
    semester: { type: DataTypes.INTEGER, allowNull: false },
    programId: { type: DataTypes.INTEGER, allowNull: false, field: 'program_id', references: { model: 'study_programs', key: 'id' } },
  }, {
    tableName: 'study_programs_year',
    timestamps: false,
  });

  StudyProgramYear.associate = (models) => {
    StudyProgramYear.belongsTo(models.StudyProgram, { foreignKey: 'program_id', as: 'program' });
    StudyProgramYear.hasMany(models.Subject,        { foreignKey: 'study_programs_year_id', as: 'subjects' });
  };

  return StudyProgramYear;
};