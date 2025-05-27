/*const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
// eventRoutes.js
const verifyToken = require('../middleware/authmiddleware');


// Create Event
/*router.post('/', async(req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});*/

//Create Event
// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/authmiddleware');

/*router.post('/', verifyToken, async(req, res) => {
    try {
        const {
            childName,
            eventTitle,
            eventDescription,
            eventDate,
            eventImage,
            giftName,
            charity,
            totalTargetAmount,
            splitPercentage,
            guestsInvited,
            status
        } = req.body;
        

        const event = new Event({
            host: req.userId,
            childName,
            eventTitle,
            eventDescription,
            eventDate,
            eventImage,
            giftName,
            charity,
            totalTargetAmount,
            splitPercentage,
            guestsInvited,
            status
        });

        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create event', error: err.message });
    }
});*/

router.post('/', verifyToken, async(req, res) => {
    try {
        const eventData = {
            ...req.body,
            host: req.user.id // ✅ Assign host from authenticated user
        };

        const newEvent = new Event(eventData);
        await newEvent.save();

        res.status(201).json(newEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ message: 'Failed to create event', error: err.message });
    }
});



// Get All Events
router.get('/', async(req, res) => {
    try {
        const events = await Event.find().populate('host').populate('charity.charityId');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Event by ID
router.get('/:id', async(req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('host').populate('charity.charityId');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Event
router.put('/:id', async(req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Event
router.delete('/:id', async(req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;