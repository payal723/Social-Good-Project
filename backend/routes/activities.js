// backend/routes/activities.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = require('../models/activity');
const User = require('../models/user');

console.log("✅✅✅ Activities Router File is Loaded! ✅✅✅"); 

// --- Get Community Feed ---
router.get('/community-feed', async (req, res) => {
    console.log("➡️ GET /community-feed route was hit!"); 
    try {
        const recentActivities = await Activity.find()
            .populate('organizer', 'username')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(recentActivities);
    } catch (error) {
        console.error("Error in /community-feed:", error);
        res.status(500).json({ message: 'Error fetching community feed.' });
    }
});

// --- Get all actions for a specific user ---
router.get('/user/:userId', async (req, res) => {
    console.log(`➡️ GET /user/${req.params.userId} route was hit!`);
    try {
        const userActivities = await Activity.find({ participants: req.params.userId })
            .populate('organizer', 'username')
            .sort({ date: -1 });
        res.json(userActivities);
    } catch (error) {
        console.error("Error in /user/:userId:", error);
        res.status(500).json({ message: 'Error fetching user actions.' });
    }
});


// --- Create a new activity with details ---
router.post('/create', async (req, res) => {
    try {
        const { title, description, type, date, organizerId, treesPlanted, wasteCleaned, location } = req.body;

        if (!title || !description || !type || !date || !organizerId || !location) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        
        if (!mongoose.Types.ObjectId.isValid(organizerId)) {
            return res.status(400).json({ message: 'Invalid organizer ID format.' });
        }

        const user = await User.findById(organizerId);
        if (!user) {
            return res.status(404).json({ message: "Organizer user not found." });
        }

        const activity = new Activity({
            title,
            description,
            type,
            date,
            location,
            organizer: organizerId,
            participants: [organizerId],
            treesPlanted: Math.max(0, parseInt(treesPlanted) || 0),
            wasteCleaned: Math.max(0, parseFloat(wasteCleaned) || 0)
        });
        await activity.save();

        user.points += 50;
        user.treesPlanted = (user.treesPlanted || 0) + activity.treesPlanted;
        user.drivesJoined = (user.drivesJoined || 0) + 1;
        await user.save();
        
        const newActivity = await Activity.findById(activity._id).populate('organizer', 'username');
        res.status(201).json(newActivity);

    } catch (error) {
        console.error("Error creating activity:", error);
        res.status(500).json({ message: "Server error while creating activity." });
    }
});


// GET all activities
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find().populate('organizer', 'username').sort({ date: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities.' });
    }
});


// Join an activity
router.post('/join', async (req, res) => {
    res.status(501).json({ message: 'Join functionality not implemented yet.' });
});

router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const activityId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const activity = await Activity.findById(activityId);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        const userIndex = activity.likes.findIndex(id => id.toString() === userId);

        if (userIndex > -1) {
            activity.likes.splice(userIndex, 1);
        } else {
            activity.likes.push(userId);
        }

        await activity.save();
        
        const updatedActivity = await Activity.findById(activityId).populate('organizer', 'username');
        res.status(200).json(updatedActivity);

    } catch (error) {
        console.error("Error liking activity:", error);
        res.status(500).json({ message: "Server error while liking activity." });
    }
});

module.exports = router;