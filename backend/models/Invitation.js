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
        default: null // For public invites
    },
    invitationCode: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true // This is the email of the invited person
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // This is the user who sent the invite
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