const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    website: String,
    logoUrl: String, // Optional: logo image URL
    image: String, // ✅ New field: general image or banner
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Charity', charitySchema);