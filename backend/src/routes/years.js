// src/routes/years.js
const router = require('express').Router();
const yearsCtrl = require('../controllers/yearController');

// GET /api/programs/:programId/years
router.get('/programs/:programId/years', yearsCtrl.listByProgram);

module.exports = router;