// src/models/StudyProgram.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudyProgram = sequelize.define('StudyProgram', {
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
    tableName: 'study_programs',
    timestamps: false,
  });

  StudyProgram.associate = (models) => {
    StudyProgram.hasMany(models.StudyProgramYear, { foreignKey: 'program_id', as: 'years' });
  };

  return StudyProgram;
};
