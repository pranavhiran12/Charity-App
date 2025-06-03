const express = require('express');
const router = express.Router();
const Invitation = require('../models/Invitation');
const Guest = require('../models/Guest');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');

// Create/send invitation manually
router.post('/send', async(req, res) => {
    try {
        const { eventId, guestId } = req.body;

        const guest = await Guest.findById(guestId);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });

        const invitation = new Invitation({
            eventId,
            guestId,
            invitationCode: uuidv4()
        });

        await invitation.save();
        res.status(201).json({ message: 'Invitation created', invitation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// invitations.js (Express)
// PUT /invitations/:code/respond
router.put('/:invitationCode/respond', async(req, res) => {


    try {



        const { invitationCode } = req.params;
        const { status } = req.body;

        console.log(`Received response for code: ${invitationCode}, status: ${status}`);

        const invitation = await Invitation.findOneAndUpdate({ invitationCode }, { status }, { new: true }).populate('eventId').populate('guestId');
        if (!invitation) {
            console.log("❌ Invitation not found");
            return res.status(404).json({ message: 'Invitation not found' });
        }

        console.log("✅ Invitation found:", invitation.code);
        // console.log("🔗 Linked Guest ID:", invitation.guestId?._id);


        const updatedGuest = await Guest.findByIdAndUpdate(
            invitation.guestId._id, { status }, { new: true }
        );

        console.log("✅ Guest updated:", updatedGuest);

        res.json({
            message: `Invitation ${status}`,
            invitation,
        });
    } catch (err) {
        console.error("🔥 Error in invitation response:", err);
        res.status(500).json({ message: 'Failed to respond to invitation' });
    }
});


// RSVP endpoint
// RSVP route in guest.js
router.post('/rsvp/:code', async(req, res) => {
    const { status } = req.body; // "Accepted" or "Declined"
    try {
        const guest = await Guest.findOne({ invitationCode: req.params.code });
        if (!guest) return res.status(404).json({ message: "Guest not found" });

        guest.status = status;
        await guest.save();

        res.json({ message: 'RSVP updated', guest });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// GET /api/invitations/event/:eventId
router.get('/event/:eventId', async(req, res) => {
    try {
        const guests = await Guest.find({ eventId: req.params.eventId }).lean();

        // Fetch all invitations related to this event and guest
        const invitations = await Invitation.find({ eventId: req.params.eventId });

        // Merge RSVP status into guest objects
        const guestsWithRSVP = guests.map(guest => {
            const invite = invitations.find(inv => inv.guestId.toString() === guest._id.toString());
            return {
                ...guest,
                rsvpStatus: invite ? invite.status : 'pending'
            };
        });

        res.json(guestsWithRSVP);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get single invitation by code
router.get('/:code', async(req, res) => {
    try {
        const invitation = await Invitation.findOne({ invitationCode: req.params.code }).populate('guestId eventId');
        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
        res.json(invitation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Auto-link (fetch or create) via POST


router.post('/autolink', async(req, res) => {
    const { eventId, guestId } = req.body;

    console.log('Received eventId:', eventId, 'guestId:', guestId);

    if (!eventId || !guestId) {
        return res.status(400).json({ message: 'Missing eventId or guestId' });
    }

    try {
        const existing = await Invitation.findOne({ eventId, guestId });
        if (existing) {
            console.log('Existing invitation found:', existing);
            return res.status(200).json({ invitationCode: existing.invitationCode });
        }

        const invitationCode = uuidv4();
        console.log('Generated invitationCode:', invitationCode);

        const newInvitation = new Invitation({ eventId, guestId, invitationCode });
        await newInvitation.save();

        res.status(201).json({ invitationCode });
    } catch (error) {
        console.error('AutoLink Error:', error);
        res.status(500).json({ message: 'Error generating/fetching invitation' });
    }
});

//const Guest = require('../models/Guest');
//const Invitation = require('../models/Invitation');

router.put('/rsvp/:inviteCode', async(req, res) => {
    try {
        const { inviteCode } = req.params;
        const { rsvp } = req.body;

        if (!['Yes', 'No', 'Maybe'].includes(rsvp)) {
            return res.status(400).json({ message: 'Invalid RSVP response' });
        }

        // Find invitation
        const invitation = await Invitation.findOne({ code: inviteCode });
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        // Find guest
        const guest = await Guest.findById(invitation.guestId);
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        // Update RSVP and status
        guest.rsvp = rsvp;

        // Map RSVP to status
        if (rsvp === 'Yes') {
            guest.status = 'accepted';
        } else if (rsvp === 'No') {
            guest.status = 'declined';
        } else {
            guest.status = 'pending';
        }

        await guest.save();

        res.json({ message: 'RSVP and status updated successfully', guest });
    } catch (err) {
        console.error('RSVP update failed:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;