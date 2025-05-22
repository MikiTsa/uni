// src/routes/programs.js
const router = require('express').Router();
const programsCtrl = require('../controllers/programController');

// GET /api/programs
router.get('/', programsCtrl.list);
router.get('/:id', programsCtrl.listById);
module.exports = router;
