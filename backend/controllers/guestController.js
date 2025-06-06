const Guest = require('../models/Guest');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const Invitation = require('../models/Invitation');
//const { createGuest } = require('../controllers/guestController');



console.log("👋 Guest routes loaded");

// RSVP a guest for an event
exports.rsvpGuest = async(req, res) => {
    const { eventId } = req.params;
    const { name, email, rsvp } = req.body;

    if (!name || !email || !rsvp) {
        return res.status(400).json({ error: 'Missing name, email, or rsvp' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID format' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        let guest = await Guest.findOne({ eventId, email });

        if (guest) {
            guest.name = name;
            guest.rsvp = rsvp;
            await guest.save();
        } else {
            guest = new Guest({ name, email, rsvp, eventId });
            await guest.save();
        }

        res.status(200).json({ message: 'RSVP saved successfully', guest });
    } catch (err) {
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
};

// Add a new guest to an event
exports.addGuestToEvent = async(req, res) => {
    try {
        const { name, email } = req.body;
        const { eventId } = req.params;

        const guest = new Guest({ name, email, eventId });
        await guest.save();

        res.status(201).json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get guest by eventId and email (query params)
exports.getGuestByEmail = async(req, res) => {
    try {
        const { eventId, email } = req.query;
        if (!eventId || !email) return res.status(400).json({ message: 'Missing eventId or email' });

        const guest = await Guest.findOne({ eventId, email });
        if (!guest) return res.status(404).json({ message: 'Guest not found' });

        res.json(guest);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Lightweight version
exports.findGuest = async(req, res) => {
    const { eventId, email } = req.query;
    const guest = await Guest.findOne({ eventId, email });
    if (!guest) return res.status(404).json(null);
    res.json(guest);
};

// Get all guests for a specific event
exports.getGuestsByEvent = async(req, res) => {
    try {
        const guests = await Guest.find({ eventId: req.params.eventId });
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all guests
exports.getAllGuests = async(req, res) => {
    try {
        const guests = await Guest.find();
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteGuest = async(req, res) => {
    try {
        const { guestId } = req.params;

        // Delete guest
        await Guest.findByIdAndDelete(guestId);

        // Delete associated invitation(s)
        await Invitation.deleteOne({ guestId });

        res.json({ message: 'Guest and their invitation deleted.' });
    } catch (err) {
        console.error('Error deleting guest:', err);
        res.status(500).json({ error: 'Failed to delete guest.' });
    }
};

// Update guest by ID
exports.updateGuest = async(req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.createGuest = async(req, res) => {
    const { name, email, mobile, eventId } = req.body;

    console.log("🎯 /api/guests POST hit");
    console.log("Body:", req.body);

    console.log("Incoming guest data:", req.body); // 🐞 Debug log

    try {
        const guest = new Guest({ name, email, mobile, eventId, status: 'Pending' });
        await guest.save();
        res.status(201).json(guest);
    } catch (err) {
        console.error("Guest creation error:", err.message); // 🐞 Debug log
        res.status(400).json({ message: 'Guest creation failed', error: err.message });
    }
};