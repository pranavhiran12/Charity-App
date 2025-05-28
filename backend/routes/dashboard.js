// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Guest = require('../models/Guest');
const Contribution = require('../models/Contribution');
const authMiddlewares = require('../middleware/authmiddleware');

/*router.get('/summary', authMiddlewares, async(req, res) => {
    try {

        console.log('🪵 req.user from token:', req.user); // DEBUG
        const userId = req.user._id; // extracted by authMiddleware

        // Fetch all events hosted by the logged-in user
        const events = await Event.find({ host: userId });

        // Extract all event IDs
        const eventIds = events.map(event => event._id);

        // Fetch related guests and contributions
        const guests = await Guest.find({ eventId: { $in: eventIds } });
        const contributions = await Contribution.find({ eventId: { $in: eventIds } });

        // Calculate totals
        const totalGiftAmount = contributions.reduce((sum, c) => sum + (c.amountForGift || 0), 0);
        const totalCharityAmount = contributions.reduce((sum, c) => sum + (c.amountForCharity || 0), 0);

        // Send response
        res.json({
            totalEvents: events.length,
            totalGuests: guests.length,
            totalContributions: contributions.length,
            totalGiftAmount,
            totalCharityAmount
        });
    } catch (err) {
        console.error('Dashboard summary error:', err);
        res.status(500).json({ message: 'Dashboard summary fetch error', error: err.message });
    }
});

module.exports = router;*/
const mongoose = require('mongoose');

router.get('/summary', authMiddlewares, async(req, res) => {
    try {
        const userId = req.user._id || req.user.id || req.user.userId;
        console.log("USER ID from token:", userId);

        const events = await Event.find({
            host: mongoose.Types.ObjectId.isValid(userId) ?
                new mongoose.Types.ObjectId(userId) : userId
        });

        const eventIds = events.map(event => event._id);
        const guests = await Guest.find({ eventId: { $in: eventIds } });
        const contributions = await Contribution.find({ eventId: { $in: eventIds } });

        const totalGiftAmount = contributions.reduce((sum, c) => sum + (c.amountForGift || 0), 0);
        const totalCharityAmount = contributions.reduce((sum, c) => sum + (c.amountForCharity || 0), 0);

        res.json({
            totalEvents: events.length,
            totalGuests: guests.length,
            totalContributions: contributions.length,
            totalGiftAmount,
            totalCharityAmount
        });
    } catch (err) {
        console.error('Dashboard summary error:', err);
        res.status(500).json({ message: 'Dashboard summary fetch error', error: err.message });
    }
});

module.exports = router;