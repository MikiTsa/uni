// src/routes/subjects.js
const router = require('express').Router();
const subjectCtrl = require('../controllers/subjectController');


router.get('/:id', subjectCtrl.listById);
// GET /api/years/:yearId/subjects
router.get('/years/:yearId/subjects', subjectCtrl.listByYear);

router.get(
    '/program/:program/level/:level/semester/:semester',
    subjectCtrl.listByProgramLevelSemester
  );

module.exports = router;