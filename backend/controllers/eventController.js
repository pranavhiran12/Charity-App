const Event = require('../models/Event');

// @desc    Create new event
exports.createEvent = async(req, res) => {
    try {
        const eventData = {
            ...req.body,
            host: req.user.id, // authenticated user
        };

        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ message: 'Failed to create event', error: err.message });
    }
};

// @desc    Get all events
exports.getAllEvents = async(req, res) => {
    try {
        const events = await Event.find()
            .populate('host')
            .populate('charity.charityId');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get event by ID
exports.getEventById = async(req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('host')
            .populate('charity.charityId');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update event
exports.updateEvent = async(req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Delete event
exports.deleteEvent = async(req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};