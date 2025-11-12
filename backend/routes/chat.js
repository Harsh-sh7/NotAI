const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

// @route   GET /api/chats
// @desc    Get all chats for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user.id })
            .sort({ lastUpdated: -1 })
            .select('title lastUpdated messages');
        res.json(chats);
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/chats
// @desc    Create a new chat
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title = 'New Chat' } = req.body;
        
        const chat = new Chat({
            user: req.user.id,
            title,
            messages: []
        });

        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/chats/:id
// @desc    Get a specific chat with messages
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const chat = await Chat.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Get chat error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/chats/:id
// @desc    Update a chat (add a new message)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { role, content } = req.body;
        
        if (!role || !content) {
            return res.status(400).json({ error: 'Role and content are required' });
        }

        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { 
                $push: { 
                    messages: { role, content } 
                },
                $set: { lastUpdated: Date.now() }
            },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Update chat error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/chats/:id/title
// @desc    Update chat title
// @access  Private
router.put('/:id/title', auth, async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Update chat title error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/chats/:id
// @desc    Delete a chat
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Delete chat error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
