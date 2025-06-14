const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    givenName: String,
    familyName: String,
    prefix: String,
    mobile: String,
    address: {
        street: String,
        city: String,
        country: String
    },
    newsletter: Boolean,
    bankDetails: {
        bankName: String,
        branchCode: String,
        accountHolder: String,
        accountNumber: String
    },
    agreedToTerms: Boolean
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);