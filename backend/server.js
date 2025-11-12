
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

const LANGUAGE_IDS = {
    javascript: 93, // Node.js
    python: 92,     // Python 3
    java: 91,       // Java
    cpp: 54         // C++ (GCC 9.2.0)
};

app.post('/execute', async (req, res) => {
    const { language, code, stdin } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: 'Language and code are required.' });
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
        return res.status(400).json({ error: `Language '${language}' is not supported.` });
    }

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            language_id: languageId,
            source_code: code,
            stdin: stdin || ''
        }
    };

    try {
        const submissionResponse = await axios.request(options);
        const { token } = submissionResponse.data;

        if (!token) {
            return res.status(500).json({ error: 'Failed to get submission token.' });
        }

        let result;
        const getResultOptions = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: {
                base64_encoded: 'false',
                fields: '*'
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        };

        // Poll for the result
        const poll = async () => {
            const resultResponse = await axios.request(getResultOptions);
            const statusId = resultResponse.data.status.id;

            // 1: In Queue, 2: Processing
            if (statusId === 1 || statusId === 2) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
                return poll();
            } else {
                return resultResponse.data;
            }
        };

        result = await poll();
        res.json(result);

    } catch (error) {
        console.error('Error with Judge0 API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while executing the code.' });
    }
});

app.listen(port, () => {
    console.log(`Code execution server listening on port ${port}`);
});
