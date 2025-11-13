const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', { body: req.body });
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            console.log('Validation failed: Missing fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('User already exists:', { existingUser });
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        console.log('Attempting to save user...');
        await user.save();
        console.log('User saved successfully:', { userId: user._id });

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isGoogleAuth: user.isGoogleAuth
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        
        // More detailed error handling
        let errorMessage = 'Server error during signup';
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ error: messages });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: 'A user with this email or username already exists' 
            });
        }
        
        // Handle JWT errors
        if (error.name === 'JsonWebTokenError') {
            console.error('JWT Error - Check your JWT_SECRET in .env');
            errorMessage = 'Authentication error';
        }
        
        console.error('Full error object:', JSON.stringify(error, null, 2));
        res.status(500).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isGoogleAuth: user.isGoogleAuth
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isGoogleAuth: user.isGoogleAuth
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google', 
    passport.authenticate('google', { 
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        try {
            console.log('OAuth callback - User:', req.user);
            
            if (!req.user) {
                console.error('No user found in OAuth callback');
                const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
                return res.redirect(`${frontendURL}/?error=no_user`);
            }
            
            // Generate JWT token for the authenticated user
            const token = generateToken(req.user._id);
            console.log('Generated token for user:', req.user._id);
            
            // Redirect to frontend with token - redirect to home since we always show main app now
            const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
            const redirectURL = `${frontendURL}/auth/callback?token=${token}&redirect=/`;
            console.log('Redirecting to:', redirectURL);
            res.redirect(redirectURL);
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendURL}/?error=callback_error`);
        }
    }
);

module.exports = router;
