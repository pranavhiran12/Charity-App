/*const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");

// Add new guest
router.post("/event/:eventId", async(req, res) => {
    try {
        const { name, email } = req.body;
        const eventId = req.params.eventId;

        const guest = new Guest({ name, email, eventId });
        await guest.save();

        res.status(201).json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get all guests for an event
router.get("/event/:eventId", async(req, res) => {
    try {
        const guests = await Guest.find({ eventId: req.params.eventId });
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all guests
router.get("/", async(req, res) => {
    try {
        const guests = await Guest.find();
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update guest RSVP
router.put("/:id", async(req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;*/

const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");
const Event = require("../models/Event");
const mongoose = require("mongoose");

// ✅ RSVP route: POST /api/guests/:eventId/rsvp

router.post("/:eventId/rsvp", async(req, res) => {
    const { eventId } = req.params;
    const { name, email, rsvp } = req.body;

    if (!name || !email || !rsvp) {
        return res.status(400).json({ error: "Missing name, email, or rsvp" });
    }

    console.log("RSVP request received:", { eventId, name, email, rsvp });

    try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }

        const event = await Event.findById(eventId);
        if (!event) {

            console.log("Event not found:", eventId);
            return res.status(404).json({ error: "Event not found" });
        }

        let guest = await Guest.findOne({ eventId, email });

        if (guest) {
            guest.name = name;
            guest.rsvp = rsvp;
            await guest.save();
        } else {
            guest = new Guest({ name, email, rsvp, eventId });
            await guest.save();
        }

        return res.status(200).json({ message: "RSVP saved successfully", guest });
    } catch (err) {
        console.error("RSVP error:", err.message || err);
        res.status(500).json({ error: "Server error", detail: err.message });
    }
});


// ✅ Add new guest to an event
router.post("/event/:eventId", async(req, res) => {
    try {
        const { name, email } = req.body;
        const eventId = req.params.eventId;

        const guest = new Guest({ name, email, eventId });
        await guest.save();

        res.status(201).json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ Get all guests for an event
router.get("/event/:eventId", async(req, res) => {
    try {
        const guests = await Guest.find({ eventId: req.params.eventId });
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all guests
router.get("/", async(req, res) => {
    try {
        const guests = await Guest.find();
        res.json(guests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update guest RSVP by guest ID
router.put("/:id", async(req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(guest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;