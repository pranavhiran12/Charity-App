const Guest = require('../models/Guest');

// GET all guests for a user and event
const getGuests = async(req, res) => {
    try {
        const { eventId } = req.query;
        if (!eventId) return res.status(400).json({ message: 'Event ID is required' });

        const guests = await Guest.find({
            userId: req.user._id,
            eventId
        });

        res.json(guests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST a new guest and return updated guest list
const addGuest = async(req, res) => {
    try {
        const { name, email, mobile, eventId } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

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

        // Return updated guest list
        const updatedList = await Guest.find({ userId: req.user._id, eventId });
        res.status(201).json(updatedList);
    } catch (err) {
        res.status(400).json({ message: 'Error saving contact', error: err.message });
    }
};

// DELETE guest and return updated guest list
const deleteGuest = async(req, res) => {
    try {
        const guest = await Guest.findOne({ _id: req.params.id, userId: req.user._id });
        if (!guest) return res.status(404).json({ message: 'Guest not found' });

        const eventId = guest.eventId;
        await guest.deleteOne();

        // Return updated guest list
        const updatedList = await Guest.find({ userId: req.user._id, eventId });
        res.json(updatedList);
    } catch (err) {
        res.status(400).json({ message: 'Error deleting contact', error: err.message });
    }
};

module.exports = {
    getGuests,
    addGuest,
    deleteGuest
};