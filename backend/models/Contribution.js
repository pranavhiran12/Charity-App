// models/Contribution.js
const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String, // e.g. 'credit_card', 'paypal'
    },
    contributedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contribution', contributionSchema);