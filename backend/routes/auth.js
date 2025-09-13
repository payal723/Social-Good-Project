// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // यह पहले गलत था, इसे ठीक किया गया है
const User = require('../models/user');
const router = express.Router();

// --- नया और बेहतर: User Registration (Signup) ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken." });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            points: 0, // Start with 0 points
            badges: []
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully! Please log in." });

    } catch (error) {
        res.status(500).json({ message: "Server error during registration." });
    }
});

// --- नया और बेहतर: User Login ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        // 4. Send back user data and the token
        res.status(200).json({
            message: "Login successful",
            userId: user._id,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;