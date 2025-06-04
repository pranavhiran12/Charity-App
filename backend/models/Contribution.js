// models/Contribution.js
const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contribution', contributionSchema);