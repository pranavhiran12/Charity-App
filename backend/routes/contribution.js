const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const Guest = require('../models/Guest');
const Event = require('../models/Event');

// @route   POST /api/contributions
// @desc    Add a contribution
router.post('/', async(req, res) => {
    const { eventId, guestId, amount, message } = req.body;

    try {
        if (!eventId || !guestId || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const contribution = new Contribution({
            eventId,
            guestId,
            amount,
            message
        });

        await contribution.save();
        res.status(201).json({ message: 'Contribution added successfully', contribution });
    } catch (err) {
        console.error('Error adding contribution:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/contributions/event/:eventId
// @desc    Get all contributions for a specific event
router.get('/event/:eventId', async(req, res) => {
    try {
        const contributions = await Contribution.find({ eventId: req.params.eventId })
            .populate('guestId', 'name email') // Fetch guest info
            .sort({ contributedAt: -1 });

        res.json(contributions);
    } catch (err) {
        console.error('Error fetching event contributions:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/contributions/guest/:guestId
// @desc    Get all contributions by a guest
router.get('/guest/:guestId', async(req, res) => {
    try {
        const contributions = await Contribution.find({ guestId: req.params.guestId })
            .populate('eventId', 'title date') // Fetch event info
            .sort({ contributedAt: -1 });

        res.json(contributions);
    } catch (err) {
        console.error('Error fetching guest contributions:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/contributions/:id
// @desc    Get a single contribution by ID
router.get('/:id', async(req, res) => {
    try {
        const contribution = await Contribution.findById(req.params.id)
            .populate('guestId eventId');

        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

        res.json(contribution);
    } catch (err) {
        console.error('Error fetching contribution:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// GET /api/contributions/total/:eventId
router.get('/total/:eventId', async(req, res) => {
    try {
        const total = await Contribution.aggregate([
            { $match: { eventId: new mongoose.Types.ObjectId(req.params.eventId) } },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
        ]);

        // Assuming 'total' is the result of an aggregation query
        if (total.length > 0 && total[0].totalAmount) {
            res.json({ totalAmount: total[0].totalAmount });
        } else {
            res.json({ totalAmount: 0 });
        }


    } catch (err) {
        console.error('Error calculating total contributions:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   DELETE /api/contributions/:id
// @desc    Delete a contribution
router.delete('/:id', async(req, res) => {
    try {
        const contribution = await Contribution.findByIdAndDelete(req.params.id);
        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

        res.json({ message: 'Contribution deleted successfully' });
    } catch (err) {
        console.error('Error deleting contribution:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;