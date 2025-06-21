const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    amount: Number,
    message: String,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);