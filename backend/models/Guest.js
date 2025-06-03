const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    name: { type: String, required: true },
    email: String,
    rsvp: {
        type: String,
        enum: ["Yes", "No", "Maybe"],
        default: "Maybe"
    },
    status: {
        type: String,
        enum: ['accepted', 'declined', 'pending'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model("Guest", guestSchema);