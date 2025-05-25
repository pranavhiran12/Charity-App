const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

// ✅ POST a new guest
router.post('/', async(req, res) => {
    try {
        const guest = new Guest(req.body);
        await guest.save();
        res.status(201).json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ GET all guests for an event
router.get('/:eventId', async(req, res) => {
    try {
        const guests = await Guest.find({ event: req.params.eventId });
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;