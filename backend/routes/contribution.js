/*const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");

// Add a contribution
router.post("/", async(req, res) => {
    try {
        const contribution = new Contribution(req.body);
        await contribution.save();
        res.status(201).json(contribution);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all contributions for an event
router.get("/event/:eventId", async(req, res) => {
    try {
        const contributions = await Contribution.find({ eventId: req.params.eventId });
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a contribution (amount or message)
router.put("/:id", async(req, res) => {
    try {
        const contribution = await Contribution.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(contribution);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Add a contribution to an event
router.post('/:eventId', async(req, res) => {
    try {
        const { guestName, guestEmail, amount, message } = req.body;

        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const newContribution = {
            guestName,
            guestEmail,
            amount,
            message,
            contributedAt: new Date()
        };

        event.contributions.push(newContribution);
        await event.save();

        res.status(201).json({ message: 'Contribution added successfully', contribution: newContribution });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all contributions for an event
router.get('/:eventId', async(req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        res.json(event.contributions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total amount raised for an event
router.get('/:eventId/total', async(req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const total = event.contributions.reduce((sum, c) => sum + c.amount, 0);

        res.json({ totalAmountRaised: total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total amount raised for an event
router.get('/:eventId/total', async(req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const total = event.contributions.reduce((sum, c) => sum + c.amount, 0);

        res.json({ totalAmountRaised: total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;