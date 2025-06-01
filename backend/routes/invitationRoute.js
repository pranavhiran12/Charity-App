const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Event = require('../models/Event');
const Invitation = require('../models/Invitation');

// POST /api/invitations/send/:eventId
router.post('/send/:eventId', async(req, res) => {
    try {
        const eventId = req.params.eventId;
        const { message } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const guests = event.guestsInvited;
        if (!guests.length) return res.status(404).json({ error: 'No guests to invite' });

        for (const guest of guests) {
            const token = crypto.randomBytes(16).toString('hex');
            await Invitation.create({
                event: eventId,
                guestEmail: guest.email,
                token,
                message
            });
            console.log(`🔗 Token for ${guest.email}: ${token}`);
        }

        res.json({ message: 'Invitations created successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/invitations/event/:eventId
router.get('/event/:eventId', async(req, res) => {
    try {
        const eventId = req.params.eventId;
        const invitations = await Invitation.find({ event: eventId });

        res.json({
            total: invitations.length,
            invitations
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



// GET /api/invitations/open/:token
router.get('/open/:token', async(req, res) => {
    try {
        const token = req.params.token;
        const invitation = await Invitation.findOne({ token });
        if (!invitation) return res.status(404).json({ error: 'Invalid token' });

        invitation.status = 'opened';
        await invitation.save();

        res.json({ message: 'Invitation opened', invitation });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/invitations/respond/:token
router.post('/respond/:token', async(req, res) => {
    try {
        const { attending, message } = req.body;
        const token = req.params.token;

        const invitation = await Invitation.findOne({ token });
        if (!invitation) return res.status(404).json({ error: 'Invalid token' });

        invitation.status = 'responded';
        invitation.respondedAt = new Date();
        await invitation.save();

        res.json({ message: 'RSVP recorded', attending, message });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/test', (req, res) => {
    res.send('✅ Invitation route working');
});

module.exports = router;

/*const express = require('express');
const router = express.Router();


console.log("✅ Invitation route Loaded");

router.get('/test', (req, res) => {
    res.send('✅ Invitation route working');
});

module.exports = router;*/