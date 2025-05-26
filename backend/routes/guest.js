const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");

// Add new guest
router.post("/", async(req, res) => {
    try {
        const guest = new Guest(req.body);
        await guest.save();
        res.status(201).json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all guests for an event
router.get("/event/:eventId", async(req, res) => {
    try {
        const guests = await Guest.find({ eventId: req.params.eventId });
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all guests
router.get("/", async(req, res) => {
    try {
        const guests = await Guest.find();
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update guest RSVP
router.put("/:id", async(req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;