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
                    sender: req.user._id, // ✅ required
                    email: guest.email // ✅ required
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

        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        await Guest.findByIdAndUpdate(invitation.guestId._id, { status });

        // 🧹 Removed: WebSocket emit
        // const io = req.app.get('io');
        // io.to(invitation.eventId._id.toString()).emit('inviteeStatusUpdated', { ... });

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
//const { v4: uuidv4 } = require('uuid');
//const Invitation = require('../models/Invitation'); // ✅ Adjust path as per your structure

exports.autoLinkInvitation = async(req, res) => {
    const { eventId, guestId } = req.body;

    console.log("📥 Received autoLinkInvitation payload:", req.body);

    if (!eventId) {
        console.warn("❌ Missing eventId");
        return res.status(400).json({ message: 'Missing eventId' });
    }

    const user = req.user; // You must have authMiddleware in place

    if (!user || !user._id || !user.email) {
        return res.status(401).json({ message: 'Unauthorized: Missing user info' });
    }

    try {
        // 📎 Handle Public Invite (no guestId)
        if (!guestId) {
            const existingPublic = await Invitation.findOne({ eventId, guestId: null });

            if (existingPublic) {
                return res.status(200).json({ invitationCode: existingPublic.invitationCode });
            }

            const publicInviteCode = uuidv4();

            const newPublicInvite = new Invitation({
                eventId,
                guestId: null,
                sender: user._id,
                email: user.email,
                name: user.name || "Guest",
                invitationCode: publicInviteCode,
            });

            await newPublicInvite.save();

            return res.status(201).json({ invitationCode: publicInviteCode });
        }

        // 🎟️ Handle Guest-Specific Invite
        const existing = await Invitation.findOne({ eventId, guestId });

        if (existing) {
            return res.status(200).json({ invitationCode: existing.invitationCode });
        }

        const invitationCode = uuidv4();

        const newInvitation = new Invitation({
            eventId,
            guestId,
            sender: user._id,
            email: user.email,
            name: user.name || "Guest",
            invitationCode,
        });

        await newInvitation.save();

        return res.status(201).json({ invitationCode });

    } catch (error) {
        console.error("❌ autoLinkInvitation error:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
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

exports.updateInvitationWithGuest = async(req, res) => {
    const { invitationCode, guestId } = req.body;

    if (!invitationCode || !guestId) {
        return res.status(400).json({ message: 'Missing invitationCode or guestId' });
    }

    try {
        const updated = await Invitation.findOneAndUpdate({ invitationCode }, { guestId }, { new: true }).populate('eventId guestId');

        if (!updated) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error("❌ Error updating invitation guestId:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


// GET /api/invitations/received
exports.getReceivedInvitations = async(req, res) => {

    console.log("🚨 getReceivedInvitations function called!");
    console.log("🔐 req.user:", req.user);
    try {
        const userEmail = req.user && req.user.email;
        console.log("📧 userEmail:", userEmail);
        if (!userEmail) {
            return res.status(400).json({ message: "User email missing." });
        }

        // Find all guests with this email
        const guests = await Guest.find({ email: userEmail });
        console.log("👥 Matching guests:", guests.length, guests);
        const guestIds = guests.map(g => g._id);

        // Find invitations where:
        // - guestId matches a guest with this email
        // - OR invitation.email matches user email (for direct email invites)
        const invitations = await Invitation.find({
                $or: [
                    { guestId: { $in: guestIds } },
                    { email: userEmail }
                ]
            })
            .populate('eventId')
            .populate('guestId');

        console.log("📨 Invitations found:", invitations.length, invitations);

        res.json(invitations);
    } catch (err) {
        console.error("Error fetching received invitations:", err);
        res.status(500).json({ message: "Server error fetching invitations." });
    }
};

/*exports.getReceivedInvitations = async(req, res) => {
    const userEmail = req.user && req.user.email;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!userEmail) return res.status(400).json({ message: "User email missing." });

    const guests = await Guest.find({ email: userEmail });
    const guestIds = guests.map(g => g._id);

    const query = {
        $or: [
            { guestId: { $in: guestIds } },
            { email: userEmail }
        ]
    };

    const [invitations, totalCount] = await Promise.all([
        Invitation.find(query)
        .populate('eventId')
        .populate('guestId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
        Invitation.countDocuments(query),
    ]);

    res.json({ invitations, totalCount });
};*/

// ✅ GET /api/invitations/stats/:eventId
/*exports.getInvitationStats = async(req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
    }

    try {
        const invitedCount = await Invitation.countDocuments({ eventId });
        const acceptedCount = await Invitation.countDocuments({ eventId, status: 'accepted' });

        res.json({ invited: invitedCount, accepted: acceptedCount });
    } catch (err) {
        console.error("❌ Error fetching invitation stats:", err);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};*/

// ✅ GET /api/invitations/stats/:eventId
exports.getInvitationStats = async(req, res) => {
    const { eventId } = req.params;

    try {
        const counts = await Invitation.aggregate([{
                $match: {
                    eventId: new mongoose.Types.ObjectId(eventId)
                }
            },
            {
                $project: {
                    normalizedStatus: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$status", "accepted"] }, then: "accepted" },
                                { case: { $eq: ["$status", "declined"] }, then: "declined" },
                                { case: { $eq: ["$status", "pending"] }, then: "pending" }
                            ],
                            default: "pending"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$normalizedStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = { accepted: 0, declined: 0, pending: 0 };
        counts.forEach(item => {
            result[item._id] = item.count;
        });

        res.json(result);
    } catch (err) {
        console.error("❌ Error fetching RSVP status count:", err);
        res.status(500).json({ error: "Server error" });
    }
};