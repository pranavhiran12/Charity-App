/*const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
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
    invitationCode: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    respondedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invitation', invitationSchema);*/

const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
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
    invitationCode: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    respondedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invitation', invitationSchema);