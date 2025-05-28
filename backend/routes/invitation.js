const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const Guest = require('../models/Guest');
const Event = require('../models/Event');

// POST /api/invitations/send/:eventId
router.post('/send/:eventId', async(req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const guests = await Guest.find({ event: eventId });
        if (guests.length === 0) return res.status(404).json({ error: 'No guests found' });

        for (const guest of guests) {
            const token = crypto.randomBytes(16).toString('hex');
            await Invitation.create({
                guest: guest._id,
                event: eventId,
                token
            });
        }

        res.json({ message: 'Invitations created and tokens saved for all guests.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/invitations/open/:token
router.get('/open/:token', async(req, res) => {
    try {
        const invitation = await Invitation.findOne({ token });
        if (!invitation) return res.status(404).json({ error: 'Invalid token' });

        invitation.status = 'opened';
        await invitation.save();

        res.json({ message: 'Invitation marked as opened', invitation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/invitations/respond/:token
router.post('/respond/:token', async(req, res) => {
    try {
        const { attending, message } = req.body;

        const invitation = await Invitation.findOne({ token }).populate('guest');
        if (!invitation) return res.status(404).json({ error: 'Invalid token' });

        invitation.status = 'responded';
        invitation.respondedAt = new Date();
        invitation.guest.attending = attending;
        invitation.guest.message = message;

        await invitation.guest.save();
        await invitation.save();

        res.json({ message: 'RSVP submitted successfully', guest: invitation.guest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;