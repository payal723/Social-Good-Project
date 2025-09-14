// models/activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['cleanup', 'tree-planting', 'water-saving', 'awareness-campaign'], required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, required: true },
    treesPlanted: { type: Number, default: 0 },
    wasteCleaned: { type: Number, default: 0 }, // in KGs
    waterSaved: { type: Number, default: 0 }, // litres
    peopleReached: { type: Number, default: 0 },
    
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);