const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async(req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const options = {
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error("❌ Razorpay order creation failed:", err);
        res.status(500).json({ message: "Order creation failed", error: err });
    }
};

exports.savePayment = async(req, res) => {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, amount, message, eventId, guestId } = req.body;

    if (!razorpayPaymentId || !razorpayOrderId || !eventId || !guestId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const payment = await Payment.create({
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            amount,
            message,
            eventId,
            guestId
        });

        // ✅ Fetch guest info (optional)
        const Guest = require('../models/Guest');
        const guest = await Guest.findById(guestId);
        const recipientEmail = guest ? guest.email : null;


        // ✅ Send thank-you email
        if (recipientEmail) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"TwoPresents" <${process.env.EMAIL_USER}>`,
                to: recipientEmail,
                subject: '🎁 Thank You for Your Contribution!',
                html: `
                    <h2>Thank You, ${guest.name || 'Guest'}!</h2>
                    <p>We received your contribution of <strong>₹${amount}</strong>.</p>
                    <p>Your message: <i>${message || '—'}</i></p>
                    <p>Razorpay Payment ID: ${razorpayPaymentId}</p>
                    <p>Order ID: ${razorpayOrderId}</p>
                    <br/>
                    <p>Warm regards,<br/>The TwoPresents Team</p>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ message: "Payment saved and receipt emailed", payment });

    } catch (err) {
        console.error("❌ Error saving payment:", err);
        res.status(500).json({ message: "Failed to save payment", error: err.message });
    }
};