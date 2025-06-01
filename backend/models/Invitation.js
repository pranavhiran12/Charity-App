const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    guestEmail: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['sent', 'opened', 'responded'],
        default: 'sent'
    },
    message: {
        type: String
    },
    respondedAt: Date
});

module.exports = mongoose.model('Invitation', invitationSchema);