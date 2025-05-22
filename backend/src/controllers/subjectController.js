// src/controllers/subjectController.js
const { Subject,  StudyProgramYear} = require('../models');

exports.listById = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(parseInt(req.params.id, 10));
    res.json(subject);
  } catch (err) {
    next(err);
  }
};

exports.listByYear = async (req, res, next) => {
  try {
    const { yearId } = req.params;
    const subjects = await Subject.findAll({
      where: { studyProgramYearId: yearId },
      attributes: ['id', 'name']
    });
    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

exports.listByProgramLevelSemester = async (req, res, next) => {
  try {
    const { program, level, semester} = req.params;
    var leveDB;
    if(level == "dodiplomski")
      leveDB = "undergraduate";
    else if(level == "magisterski")
      leveDB = "master";
    else if(level == "doktorski")
      leveDB = "PhD";
    const subjects = await Subject.findAll({
      attributes: ['id', 'name'],   // only return these columns from subjects
      include: [{
        model: StudyProgramYear,
        as: 'year',                  // matches the `as: 'year'` in your Subject.associate
        attributes: [],             // we don’t need any columns from study_programs_year itself
        where: {
          program_id: parseInt(program, 10),
          degree_level: leveDB,      // 'undergraduate' | 'master' | 'PhD' | 'other'
          semester:   parseInt(semester, 10)
        }
      }]
    });

    res.json(subjects);
  } catch (err) {
    next(err);
  }
};