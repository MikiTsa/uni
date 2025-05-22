const express = require('express');
const session = require('express-session'); //npm install express-session
const app = express();

const { User } = require('../models');
const { File } = require('../models');

// Middleware for session management
app.use(session({
    secret: 'your-secret-key',  // Secret key to sign the session ID cookie
    resave: false,              // Don't save session if not modified
    saveUninitialized: true,    // Save session even if it's new, for new users
    cookie: { secure: false }   // In production, set secure: true for HTTPS
}));

// Authentication middleware
const authenticate = async (req, res, next) => {
    if (req.session && req.session.userId) {
        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// Authorization middleware
const authorize = (req, res, next) => {
    if (req.session.userId === parseInt(req.params.id)) {
        return next();  // User can access their own data
    } else {
        return res.status(403).json({ message: 'Forbidden (not your data)' });  // User trying to access someone else's data
    }
};

const authorizeTrusted = (req, res, next) => {
    if (req.user.role === 'trusted' || req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Forbidden (trusted or admin only)' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Forbidden (admin only)' });
    }
};

// user can edit own files, trusted and admin can edit all files
const canEditFile = (file) => (req, res, next) => {
    const isOwner = file.createdBy === req.user.id;
    const isTrusted = req.user.role === 'trusted';
    const isAdmin = req.user.role === 'admin';

    if (isOwner || isTrusted || isAdmin) {
        return next();
    } else {
        return res.status(403).json({ message: 'Forbidden: no permission to edit this file' });
    }
};

// user can delete own files, admin can delete all files
const canDeleteFile = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const file = await File.findByPk(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const isOwner = file.createdBy === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (isOwner || isAdmin) {
            req.file = file;
            return next();
        } else {
            return res.status(403).json({ message: 'Forbidden: no permission to delete this file' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Routes using middleware
app.get('/profile/:id', authenticate, authorize, (req, res) => {
    // Fetch and return profile data for the user with ID = req.params.id
    res.send('User profile data');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = {
    authenticate,
    authorize,
    authorizeTrusted,
    authorizeAdmin,
    canEditFile,
    canDeleteFile,
};