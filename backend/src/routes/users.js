const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST register new user
router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ userId: req.session.userId });
  }
  res.status(401).json({ message: 'Not authenticated' });
});

// GET user profile
router.get('/:id', userController.getUserProfile);

// PUT update user profile
router.put('/:id', userController.updateUserProfile);

// GET user documents
router.get('/:id/documents', userController.getUserDocuments);

// DELETE user document
router.delete('/:id/documents/:docId', userController.deleteUserDocument);



module.exports = router;
