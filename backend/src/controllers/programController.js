// src/controllers/programController.js
const { StudyProgram } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const programs = await StudyProgram.findAll({
      attributes: ['id', 'name']
    });
    res.json(programs);
  } catch (err) {
    next(err);
  }
};

exports.listById = async (req, res, next) => {
  try {
    const program = await StudyProgram.findByPk(parseInt(req.params.id, 10), {
      attributes: ['id', 'name'],
    });
    res.json(program);
  } catch (err) {
    next(err);
  }
};