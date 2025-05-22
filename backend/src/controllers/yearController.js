// src/controllers/yearController.js
const { StudyProgramYear } = require('../models');

exports.listByProgram = async (req, res, next) => {
  try {
    const { programId } = req.params;
    const years = await StudyProgramYear.findAll({
      where: { programId },
      attributes: ['id', 'year', 'degreeLevel', 'semester']
    });
    res.json(years);
  } catch (err) {
    next(err);
  }
};
