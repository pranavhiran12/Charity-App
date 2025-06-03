const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    message: {
        type: String,
        trim: true
    },
    contributedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contribution', contributionSchema);