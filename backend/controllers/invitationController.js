// ✅ controllers/invitationController.js
const Invitation = require('../models/Invitation');
const Guest = require('../models/Guest');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const crypto = require('crypto');


exports.sendInvitation = async(req, res) => {
    const { eventId } = req.params;

    try {
        const guests = await Guest.find({ eventId: new mongoose.Types.ObjectId(eventId) });

        if (!guests.length) {
            return res.status(404).json({ message: "Guest not found" });
        }

        const invitations = await Promise.all(
            guests.map(async(guest) => {
                const code = crypto.randomBytes(12).toString("hex");

                const invitation = new Invitation({
                    eventId,
                    guestId: guest._id,
                    invitationCode: code,
                    status: "pending",
                });

                await invitation.save();

                return {
                    guestId: guest._id,
                    name: guest.name,
                    invitationCode: code,
                    invitationLink: `http://localhost:5173/invite/${code}`,
                };
            })
        );

        res.status(201).json(invitations);
    } catch (err) {
        console.error("🔥 Invitation creation error:", err);
        res.status(500).json({ error: "Server error while sending invitations." });
    }
};

exports.respondToInvitation = async(req, res) => {
    try {
        const { invitationCode } = req.params;
        const { status } = req.body;

        const invitation = await Invitation.findOneAndUpdate({ invitationCode }, { status }, { new: true }).populate('eventId').populate('guestId');

        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

        const updatedGuest = await Guest.findByIdAndUpdate(
            invitation.guestId._id, { status }, { new: true }
        );

        res.json({ message: `Invitation ${status}`, invitation });
    } catch (err) {
        res.status(500).json({ message: 'Failed to respond to invitation' });
    }
};

exports.guestRSVP = async(req, res) => {
    const { status } = req.body;
    try {
        const guest = await Guest.findOne({ invitationCode: req.params.code });
        if (!guest) return res.status(404).json({ message: 'Guest not found' });

        guest.status = status;
        await guest.save();

        res.json({ message: 'RSVP updated', guest });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getInvitationsByEvent = async(req, res) => {
    try {
        const guests = await Guest.find({ eventId: req.params.eventId }).lean();
        const invitations = await Invitation.find({ eventId: req.params.eventId });

        const guestsWithRSVP = guests.map(guest => {
            const invite = invitations.find(inv => inv.guestId.toString() === guest._id.toString());
            return {...guest, rsvpStatus: invite ? invite.status : 'pending' };
        });

        res.json(guestsWithRSVP);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getInvitationByCode = async(req, res) => {
    try {
        const invitation = await Invitation.findOne({ invitationCode: req.params.code }).populate('guestId eventId');
        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
        res.json(invitation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.autoLinkInvitation = async(req, res) => {
    const { eventId, guestId } = req.body;

    if (!eventId || !guestId) return res.status(400).json({ message: 'Missing eventId or guestId' });

    try {
        const existing = await Invitation.findOne({ eventId, guestId });
        if (existing) return res.status(200).json({ invitationCode: existing.invitationCode });

        const invitationCode = uuidv4();
        const newInvitation = new Invitation({ eventId, guestId, invitationCode });
        await newInvitation.save();

        res.status(201).json({ invitationCode });
    } catch (error) {
        res.status(500).json({ message: 'Error generating/fetching invitation' });
    }
};

exports.rsvpByInviteCode = async(req, res) => {
    try {
        const { inviteCode } = req.params;
        const { rsvp } = req.body;

        if (!['Yes', 'No', 'Maybe'].includes(rsvp)) {
            return res.status(400).json({ message: 'Invalid RSVP response' });
        }

        const invitation = await Invitation.findOne({ code: inviteCode });
        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

        const guest = await Guest.findById(invitation.guestId);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });

        guest.rsvp = rsvp;
        guest.status = rsvp === 'Yes' ? 'accepted' : rsvp === 'No' ? 'declined' : 'pending';

        await guest.save();

        res.json({ message: 'RSVP and status updated successfully', guest });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};