// src/routes/files.js
const router = require('express').Router();
const filesCtrl = require('../controllers/fileController');
const multer  = require('multer');
const upload  = multer({ storage: multer.memoryStorage() });


// GET /api/subjects/:subjectId/files
router.get('/subjects/:subjectId/:tagId/files', filesCtrl.listBySubjectAndTag);

// GET /api/files?programId=…&degreeLevel=…&year=…&subjectId=…&tag=…&name=…
// primer : http://localhost:3000/api/files?name=cheatsheet
router.get('/files', filesCtrl.search);

router.get('/:id', filesCtrl.get);


router.post(
    '/upload',
    upload.single('file'),      // <– look here
    filesCtrl.create
  );

router.delete('/:id', filesCtrl.remove);

router.get('/ratings/:fileId', filesCtrl.getRatingsByFile);



// router.delete('/files/admin/:id', filesCtrl.adminDeleteInappropriate); admin delete
router.post('/:id/upvote', filesCtrl.like);
router.post('/:id/downvote', filesCtrl.dislike);

module.exports = router;