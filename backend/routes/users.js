// routes/users.js
const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Get leaderboard data (top 10 users by points)
router.get('/leaderboard', async (req, res) => {
    const leaders = await User.find().sort({ points: -1 }).limit(10);
    res.json(leaders);
});

// Get a specific user's profile/dashboard data
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

module.exports = router;
