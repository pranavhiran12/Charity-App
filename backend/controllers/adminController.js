const User = require('../models/User');
const Event = require('../models/Event');
const Contribution = require('../models/Contribution');
const Charity = require('../models/Charity');

// Get all users
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

// Get all events
exports.getAllEvents = async(req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch events', error: err.message });
    }
};

// Get all contributions
exports.getAllContributions = async(req, res) => {
    try {
        const contributions = await Contribution.find()
            .populate('event')
            .populate('user')
            .sort({ createdAt: -1 });
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch contributions', error: err.message });
    }
};

// Get all charities
exports.getAllCharities = async(req, res) => {
    try {
        const charities = await Charity.find().sort({ createdAt: -1 });
        res.json(charities);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch charities', error: err.message });
    }
};

// Create a new charity
exports.createCharity = async(req, res) => {
    try {
        const { name, description, website, logoUrl } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name) return res.status(400).json({ message: 'Charity name is required' });

        const newCharity = new Charity({ name, description, website, logoUrl, image });
        await newCharity.save();

        res.status(201).json({ message: 'Charity created successfully', charity: newCharity });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create charity', error: err.message });
    }
};

// Update charity
exports.updateCharity = async(req, res) => {
    try {
        const { name, description, website, logoUrl } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const updateFields = { name, description, website, logoUrl };
        if (image) updateFields.image = image;

        const updated = await Charity.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updated) return res.status(404).json({ message: 'Charity not found' });

        res.json({ message: 'Charity updated successfully', charity: updated });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update charity', error: err.message });
    }
};

// Delete charity
exports.deleteCharity = async(req, res) => {
    try {
        const charity = await Charity.findByIdAndDelete(req.params.id);
        if (!charity) return res.status(404).json({ message: 'Charity not found' });

        res.json({ message: 'Charity deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete charity', error: err.message });
    }
};

// Delete user
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
};

// Delete event
exports.deleteEvent = async(req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete event', error: err.message });
    }
};

// Promote user to admin
exports.makeAdmin = async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, { role: 'admin' }, { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User promoted to admin', user });
    } catch (err) {
        res.status(500).json({ message: 'Failed to promote user', error: err.message });
    }
};