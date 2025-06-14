// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner of contact
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);