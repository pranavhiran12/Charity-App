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


    console.log("📥 addGuest reached"); // ✅ First log
    try {
        const { name, email, mobile, eventId } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        if (!name || !email || !mobile || !eventId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existing = await Guest.findOne({
            eventId,
            email: normalizedEmail,
            ...(req.user && { userId: req.user._id }) // Only check user if logged in
        });

        if (existing) {
            return res.status(400).json({ message: 'This contact already exists for this event.' });
        }

        const guest = new Guest({
            name: name.trim(),
            email: normalizedEmail,
            mobile: mobile.trim(),
            eventId,
            userId: req.user ? req.user._id : null // Support public guests
        });

        await guest.save();

        console.log("✅ New guest created:", guest);

        res.status(201).json({ message: 'Guest created', guest });

    } catch (err) {
        console.error("❌ Error saving guest:", err.message);
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


// CREATE guest without requiring authentication (for public invite link)
const createGuest = async(req, res) => {
    try {
        const { name, email, mobile, eventId } = req.body;

        if (!name || !email || !mobile || !eventId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existing = await Guest.findOne({ eventId, email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ message: 'This guest already exists for this event.' });
        }

        const newGuest = new Guest({
            name: name.trim(),
            email: normalizedEmail,
            mobile: mobile.trim(),
            eventId,
            userId: null // public guest, no auth
        });

        await newGuest.save();
        res.status(201).json({ message: 'Public guest created', guest: newGuest });

    } catch (err) {
        console.error("❌ Error creating public guest:", err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


module.exports = {
    getGuests,
    addGuest,
    deleteGuest,
    createGuest
};