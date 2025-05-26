const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    guestName: String,
    guestEmail: String,
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    message: String,
    contributedAt: {
        type: Date,
        default: Date.now
    }
});

const eventSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    childName: {
        type: String,
        required: true
    },
    eventTitle: {
        type: String,
        required: true
    },
    eventDescription: String,
    eventDate: {
        type: Date,
        required: true
    },
    eventImage: String,

    giftName: {
        type: String,
        required: true
    },
    charity: {
        name: String,
        description: String,
        charityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Charity'
        }
    },

    totalTargetAmount: {
        type: Number,
        required: true
    },
    splitPercentage: {
        gift: { type: Number, default: 50 },
        charity: { type: Number, default: 50 }
    },

    totalTargetAmount: {
        type: Number,
        required: true
    },

    contributions: [contributionSchema],

    guestsInvited: [{
        name: String,
        email: String,
        invitedAt: { type: Date, default: Date.now }
    }],

    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }



});

module.exports = mongoose.model('Event', eventSchema);