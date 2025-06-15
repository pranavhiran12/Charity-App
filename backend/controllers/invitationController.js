/*// ✅ controllers/invitationController.js
const Invitation = require('../models/Invitation');
const nodemailer = require('nodemailer'); // For resend feature
const Guest = require('../models/Guest');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const crypto = require('crypto');


exports.sendInvitation = async(req, res) => {
    try {
        const senderId = req.user._id; // ✅ Make sure auth middleware sets this
        const eventId = req.params.eventId;

        const guests = await Guest.find({ userId: senderId }); // or however you get guest list

        for (const guest of guests) {
            const code = generateUniqueCode(); // implement your own unique code generator
            const newInvitation = new Invitation({
                eventId,
                guestId: guest._id,
                senderId, // ✅ this is required
                invitationCode: code
            });

            await newInvitation.save();
        }

        res.status(200).json({ message: 'Invitations sent successfully.' });
    } catch (err) {
        console.error("🔥 Invitation creation error:", err);
        res.status(500).json({ error: err.message });
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

// 1. Get all invitations sent by the logged-in user
exports.getInvitationsByUser = async(req, res) => {
    try {
        const userId = req.user._id; // Assumes authentication middleware sets req.user
        const events = await Event.find({ userId });
        const eventIds = events.map(event => event._id);

        const invitations = await Invitation.find({ eventId: { $in: eventIds } })
            .populate('guestId eventId');

        res.json(invitations);
    } catch (err) {
        console.error("❌ Error fetching user invitations:", err);
        res.status(500).json({ message: 'Server error fetching user invitations' });
    }
};


// 2. Send invitations in bulk (replaces existing invitations)
exports.sendBulkInvitations = async(req, res) => {
    const { eventId } = req.params;

    try {
        const guests = await Guest.find({ eventId });

        if (!guests.length) {
            return res.status(404).json({ message: 'No guests found for this event' });
        }

        await Invitation.deleteMany({ eventId });

        const invitations = await Promise.all(
            guests.map(async guest => {
                const code = crypto.randomBytes(12).toString('hex');
                const invitation = new Invitation({
                    eventId,
                    guestId: guest._id,
                    invitationCode: code,
                    status: 'pending',
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

        res.status(201).json({ message: 'Bulk invitations sent successfully', invitations });
    } catch (err) {
        console.error("❌ Error sending bulk invitations:", err);
        res.status(500).json({ message: 'Server error during bulk invitation send' });
    }
};


// 3. Cancel an invitation
exports.cancelInvitation = async(req, res) => {
    const { invitationCode } = req.params;

    try {
        const invitation = await Invitation.findOne({ invitationCode });

        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

        invitation.status = 'cancelled';
        await invitation.save();

        const guest = await Guest.findById(invitation.guestId);
        if (guest) {
            guest.status = 'cancelled';
            await guest.save();
        }

        res.json({ message: 'Invitation cancelled successfully' });
    } catch (err) {
        console.error("❌ Error cancelling invitation:", err);
        res.status(500).json({ message: 'Server error cancelling invitation' });
    }
};

// 4. Resend invitation email
exports.resendInvitationEmail = async(req, res) => {
    const { invitationCode } = req.params;

    try {
        const invitation = await Invitation.findOne({ invitationCode }).populate('guestId eventId');

        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

        const { guestId, eventId } = invitation;
        const to = guestId.email;
        const name = guestId.name;
        const subject = `You're invited to ${eventId.title}`;
        const link = `http://localhost:5173/invite/${invitationCode}`;
        const text = `Hi ${name},\n\nYou're invited to "${eventId.title}". Please RSVP using the link below:\n\n${link}\n\nThanks!`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        res.json({ message: 'Invitation email resent successfully' });
    } catch (err) {
        console.error("❌ Error resending invitation email:", err);
        res.status(500).json({ message: 'Failed to resend invitation email' });
    }
};*/

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


/*exports.sendBulkInvitations = async(req, res) => {
    const { guestIds } = req.body;
    const { eventId } = req.params;

    if (!guestIds || !Array.isArray(guestIds) || guestIds.length === 0) {
        return res.status(400).json({ message: "No valid guest IDs provided." });
    }

    try {
        const invitations = await Promise.all(
            guestIds.map(async guestId => {
                // Optional: verify guest belongs to event
                const guest = await GuestModel.findOne({ _id: guestId, eventId });
                if (!guest) return null;

                // Create or retrieve invitation
                const invite = await InvitationModel.findOneAndUpdate({ guestId, eventId }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

                return { invitationCode: invite.invitationCode };
            })
        );

        // Filter out any `null` where guest didn't match event
        const filtered = invitations.filter(Boolean);

        res.json(filtered);
    } catch (err) {
        console.error("Bulk invitation error:", err);
        res.status(500).json({ message: "Failed to send invitations." });
    }
};*/



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