const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Contest Submission Schema
const mongoose = require('mongoose');

const contestSubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemTitle: {
        type: String,
        required: true
    },
    problemDescription: String,
    difficulty: String,
    topic: String,
    language: String,
    code: String,
    solved: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 1
    },
    lastAttemptedAt: {
        type: Date,
        default: Date.now
    },
    solvedAt: Date,
    testCases: [{
        input: String,
        expectedOutput: String,
        isHidden: Boolean
    }]
}, {
    timestamps: true
});

// Create compound index for user and problem
contestSubmissionSchema.index({ userId: 1, problemTitle: 1 });

const ContestSubmission = mongoose.model('ContestSubmission', contestSubmissionSchema);

// @route   POST /api/contest/submit
// @desc    Save or update a contest submission
// @access  Private
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { problemTitle, problemDescription, difficulty, topic, language, code, solved, testCases } = req.body;

        // Find existing submission for this user and problem
        let submission = await ContestSubmission.findOne({
            userId: req.user.id,
            problemTitle: problemTitle
        });

        if (submission) {
            // Update existing submission
            submission.code = code;
            submission.language = language;
            submission.attempts += 1;
            submission.lastAttemptedAt = new Date();
            
            if (solved && !submission.solved) {
                submission.solved = true;
                submission.solvedAt = new Date();
            }
            
            await submission.save();
        } else {
            // Create new submission
            submission = new ContestSubmission({
                userId: req.user.id,
                problemTitle,
                problemDescription,
                difficulty,
                topic,
                language,
                code,
                solved,
                solvedAt: solved ? new Date() : null,
                testCases
            });
            
            await submission.save();
        }

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Error saving contest submission:', error);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});

// @route   GET /api/contest/submissions
// @desc    Get all submissions for the current user
// @access  Private
router.get('/submissions', authMiddleware, async (req, res) => {
    try {
        const submissions = await ContestSubmission.find({ userId: req.user.id })
            .sort({ lastAttemptedAt: -1 });

        res.json({
            success: true,
            submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// @route   GET /api/contest/submission/:problemTitle
// @desc    Get a specific submission by problem title
// @access  Private
router.get('/submission/:problemTitle', authMiddleware, async (req, res) => {
    try {
        const submission = await ContestSubmission.findOne({
            userId: req.user.id,
            problemTitle: req.params.problemTitle
        });

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ error: 'Failed to fetch submission' });
    }
});

// @route   GET /api/contest/leaderboard
// @desc    Get leaderboard with user rankings (optionally filtered by difficulty)
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const { difficulty } = req.query; // Optional: 'Beginner', 'Intermediate', 'Expert'
        
        // Build match conditions
        const matchConditions = {};
        if (difficulty && ['Beginner', 'Intermediate', 'Expert'].includes(difficulty)) {
            matchConditions.difficulty = difficulty;
        }
        
        // Get leaderboard with solved count and success rate
        const leaderboard = await ContestSubmission.aggregate([
            {
                $match: matchConditions
            },
            {
                $group: {
                    _id: '$userId',
                    totalAttempted: { $sum: 1 },
                    totalSolved: {
                        $sum: { $cond: ['$solved', 1, 0] }
                    },
                    lastSolved: { $max: '$solvedAt' }
                }
            },
            {
                $match: {
                    totalSolved: { $gt: 0 } // Only show users who have solved at least one problem
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    username: '$user.username',
                    email: '$user.email',
                    totalAttempted: 1,
                    totalSolved: 1,
                    successRate: {
                        $multiply: [
                            { $divide: ['$totalSolved', '$totalAttempted'] },
                            100
                        ]
                    },
                    lastSolved: 1
                }
            },
            {
                $sort: { totalSolved: -1, successRate: -1, lastSolved: -1 }
            },
            {
                $limit: 100
            }
        ]);

        res.json({
            success: true,
            leaderboard,
            difficulty: difficulty || 'All'
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// @route   GET /api/contest/stats
// @desc    Get user's contest statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const stats = await ContestSubmission.aggregate([
            {
                $match: { userId: mongoose.Types.ObjectId(req.user.id) }
            },
            {
                $group: {
                    _id: null,
                    totalAttempted: { $sum: 1 },
                    totalSolved: {
                        $sum: { $cond: ['$solved', 1, 0] }
                    },
                    byDifficulty: {
                        $push: {
                            difficulty: '$difficulty',
                            solved: '$solved'
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || { totalAttempted: 0, totalSolved: 0, byDifficulty: [] };

        // Count by difficulty
        const difficultyStats = {
            Beginner: { attempted: 0, solved: 0 },
            Intermediate: { attempted: 0, solved: 0 },
            Expert: { attempted: 0, solved: 0 }
        };

        result.byDifficulty.forEach(item => {
            if (difficultyStats[item.difficulty]) {
                difficultyStats[item.difficulty].attempted++;
                if (item.solved) {
                    difficultyStats[item.difficulty].solved++;
                }
            }
        });

        res.json({
            success: true,
            stats: {
                totalAttempted: result.totalAttempted,
                totalSolved: result.totalSolved,
                byDifficulty: difficultyStats
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
