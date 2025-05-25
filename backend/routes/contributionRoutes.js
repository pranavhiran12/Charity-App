const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const Guest = require('../models/Guest');

// Create a new contribution
router.post('/', async(req, res) => {
    try {
        const contribution = new Contribution(req.body);
        await contribution.save();

        // Update guest status
        await Guest.findByIdAndUpdate(req.body.guest, {
            hasContributed: true,
            contributedAt: new Date()
        });

        res.status(201).json(contribution);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all contributions for an event
router.get('/:eventId', async(req, res) => {
    try {
        const contributions = await Contribution.find({ event: req.params.eventId }).populate('guest');
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a contribution
router.put('/:contributionId', async(req, res) => {
    try {
        const contribution = await Contribution.findByIdAndUpdate(req.params.contributionId, req.body, { new: true });
        res.json(contribution);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a contribution
router.delete('/:contributionId', async(req, res) => {
    try {
        await Contribution.findByIdAndDelete(req.params.contributionId);
        res.json({ message: 'Contribution deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;