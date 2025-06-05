const Contribution = require('../models/Contribution');
const mongoose = require('mongoose');

// Add contribution via guest ID
exports.addContribution = async(req, res) => {
    try {
        const { eventId, guestId, amount, message } = req.body;

        if (!eventId || !guestId || !amount) {
            return res.status(400).json({ message: 'eventId, guestId and amount are required' });
        }

        const contribution = new Contribution({ eventId, guestId, amount, message });
        const saved = await contribution.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error('Error saving contribution:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Add direct contribution via name/email
exports.addDirectContribution = async(req, res) => {
    const { eventId, name, email, amount, message } = req.body;

    if (!eventId || !name || !email || !amount) {
        return res.status(400).json({ message: 'eventId, name, email, and amount are required' });
    }

    try {
        const newContribution = new Contribution({ eventId, name, email, amount, message });
        await newContribution.save();
        res.status(201).json({ message: 'Contribution successful', contribution: newContribution });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error while saving contribution.' });
    }
};

// Get all contributions for an event
exports.getEventContributions = async(req, res) => {
    try {
        const contributions = await Contribution.find({ eventId: req.params.eventId })
            .sort({ amount: -1, createdAt: -1 })
            .select('name email amount message createdAt');
        res.status(200).json(contributions);
    } catch (err) {
        console.error('Error fetching event contributions:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all contributions by guest
exports.getGuestContributions = async(req, res) => {
    try {
        const contributions = await Contribution.find({ guestId: req.params.guestId })
            .populate('eventId', 'title date')
            .sort({ contributedAt: -1 });
        res.json(contributions);
    } catch (err) {
        console.error('Error fetching guest contributions:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single contribution
exports.getContributionById = async(req, res) => {
    try {
        const contribution = await Contribution.findById(req.params.id)
            .populate('guestId eventId');
        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });
        res.json(contribution);
    } catch (err) {
        console.error('Error fetching contribution:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get total contributions for an event
exports.getTotalContributionForEvent = async(req, res) => {
    try {
        const eventObjectId = new mongoose.Types.ObjectId(req.params.eventId);
        const total = await Contribution.aggregate([
            { $match: { eventId: eventObjectId } },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
        ]);
        const totalAmount = total.length > 0 ? total[0].totalAmount : 0;
        res.json({ totalAmount });
    } catch (err) {
        console.error('Error calculating total contributions:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a contribution
exports.deleteContribution = async(req, res) => {
    try {
        const contribution = await Contribution.findByIdAndDelete(req.params.id);
        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });
        res.json({ message: 'Contribution deleted successfully' });
    } catch (err) {
        console.error('Error deleting contribution:', err);
        res.status(500).json({ message: 'Server error' });
    }
};