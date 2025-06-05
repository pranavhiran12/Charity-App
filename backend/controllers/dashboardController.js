const Event = require('../models/Event');
const Guest = require('../models/Guest');
const Contribution = require('../models/Contribution');
const mongoose = require('mongoose');

// GET /api/dashboard/summary
exports.getDashboardSummary = async(req, res) => {
    try {
        const userId = req.user._id || req.user.id || req.user.userId;

        const validUserId = mongoose.Types.ObjectId.isValid(userId) ?
            new mongoose.Types.ObjectId(userId) :
            userId;

        // Fetch events created by the logged-in user
        const events = await Event.find({ host: validUserId });
        const eventIds = events.map(event => event._id);

        // Fetch related guests and contributions
        const guests = await Guest.find({ eventId: { $in: eventIds } });
        const contributions = await Contribution.find({ eventId: { $in: eventIds } });

        // Calculate totals
        const totalGiftAmount = contributions.reduce(
            (sum, c) => sum + (c.amountForGift || 0),
            0
        );
        const totalCharityAmount = contributions.reduce(
            (sum, c) => sum + (c.amountForCharity || 0),
            0
        );

        // Return the summarized data
        res.json({
            totalEvents: events.length,
            totalGuests: guests.length,
            totalContributions: contributions.length,
            totalGiftAmount,
            totalCharityAmount
        });
    } catch (err) {
        console.error('Dashboard summary error:', err);
        res.status(500).json({
            message: 'Dashboard summary fetch error',
            error: err.message
        });
    }
};