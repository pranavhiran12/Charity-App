const Guest = require('../models/Guest');

// GET all contacts for a user and event
const getGuests = async(req, res) => {
    try {
        const { eventId } = req.query;
        if (!eventId) return res.status(400).json({ message: 'Event ID is required' });

        const guests = await Guest.find({
            userId: req.user._id, // ⬅️ ensure it filters by user
            eventId: eventId
        });

        res.json(guests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST a new guest and emit real-time update
const addGuest = async(req, res) => {
    try {
        const { name, email, mobile, eventId } = req.body;

        // Normalize email before checking
        const normalizedEmail = email.toLowerCase().trim();

        // ✅ Check for existing contact for same user, event, and email
        const existing = await Guest.findOne({
            userId: req.user._id,
            eventId,
            email: normalizedEmail,
        });

        if (existing) {
            return res.status(400).json({ message: 'This contact already exists for this event.' });
        }

        const guest = new Guest({
            name: name.trim(),
            email: normalizedEmail,
            mobile: mobile.trim(),
            eventId,
            userId: req.user._id
        });

        await guest.save();

        // Re-fetch updated guest list
        const updatedList = await Guest.find({ userId: req.user._id, eventId });

        // Emit real-time update via WebSocket
        const io = req.app.get('io');
        io.to(eventId).emit('guestListUpdated', updatedList);

        res.status(201).json(guest);
    } catch (err) {
        res.status(400).json({ message: 'Error saving contact', error: err.message });
    }
};

// DELETE guest by ID and emit real-time update
const deleteGuest = async(req, res) => {
    try {
        const guest = await Guest.findOne({ _id: req.params.id, userId: req.user._id });
        if (!guest) return res.status(404).json({ message: 'Guest not found' });

        const eventId = guest.eventId;

        await guest.deleteOne();

        // Re-fetch updated guest list
        const updatedList = await Guest.find({ userId: req.user._id, eventId });

        // Emit real-time update via WebSocket
        const io = req.app.get('io');
        io.to(eventId).emit('guestListUpdated', updatedList);

        res.json({ message: 'Guest deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting contact', error: err.message });
    }
};

module.exports = {
    getGuests,
    addGuest,
    deleteGuest
};