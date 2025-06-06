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
    mobile: { type: String }, // ✅ Add this line

    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined'], // ✅ Add 'Pending'
        default: 'Pending'
    }

}, { timestamps: true });

module.exports = mongoose.model("Guest", guestSchema);