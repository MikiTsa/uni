const { User, File } = require('../models');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'username', 'email', 'profilePicturePath', 'createdAt'],
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('getUserProfile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { username, email, profilePicturePath } = req.body;

        const [updated] = await User.update(
            { username, email, profilePicturePath },
            { where: { id: req.params.id } }
        );

        if (!updated) return res.status(404).json({ message: 'User not found' });

        const updatedUser = await User.findByPk(req.params.id, {
            attributes: ['id', 'username', 'email', 'profilePicturePath'],
        });

        res.json(updatedUser);
    } catch (err) {
        console.error('updateUserProfile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all documents by user
exports.getUserDocuments = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: {
                model: File,
                as: 'files',
                attributes: ['id', 'name', 'path', 'createdAt'],
            },
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.files);
    } catch (err) {
        console.error('getUserDocuments error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete one document by ID
exports.deleteUserDocument = async (req, res) => {
    try {
        const file = await File.findOne({
            where: {
                id: req.params.docId,
                createdBy: req.params.id,
            },
        });

        if (!file) return res.status(404).json({ message: 'File not found or not owned by user' });

        await file.destroy();
        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error('deleteUserDocument error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const { Op } = require('sequelize');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

     
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if (!email.endsWith('@student.um.si')) {
            return res.status(400).json({ message: 'Only @student.um.si emails allowed' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Username or email already exists' 
            });
        }

     
        const newUser = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            profilePicturePath: '',
            trustScore: 0,
            role: 'user'
        });

      if(req.session){
        req.session.userId = newUser.id;
      }
       
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            profilePicturePath: newUser.profilePicturePath,
            role: newUser.role,
            trustScore: newUser.trustScore
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ 
            where: { email },
            attributes: ['id', 'username', 'email', 'password', 'profilePicturePath'] 
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

       if (req.session) {
            req.session.userId = user.id;
       }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            profilePicturePath: user.profilePicturePath
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
