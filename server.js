require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
// Serve static frontend files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting: max 20 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests, please try again later.' }
});

// Initialize Gemini Client
// It automatically picks up GEMINI_API_KEY from environment
let aiClient = null;
try {
    if (process.env.GEMINI_API_KEY) {
        aiClient = new GoogleGenAI();
        console.log("AI Client initialized successfully.");
    } else {
        console.warn("WARNING: GEMINI_API_KEY is not set. Chat endpoint will return an error.");
    }
} catch (error) {
    console.error("Failed to initialize AI Client:", error);
}

// Chat Endpoint
app.post('/api/chat', limiter, async (req, res) => {
    try {
        const { message } = req.body;

        // Input validation
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
        }

        if (message.length > 1000) {
             return res.status(400).json({ error: 'Message is too long. Please limit to 1000 characters.' });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY || !aiClient) {
            return res.status(503).json({
                error: 'AI Provider is not configured. Please set the GEMINI_API_KEY environment variable on the server.'
            });
        }

        // Call Gemini API
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
        });

        if (response && response.text) {
             res.json({ reply: response.text });
        } else {
             throw new Error("Invalid response from AI provider");
        }

    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ error: 'An error occurred while communicating with the AI provider.' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});