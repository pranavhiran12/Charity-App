const Razorpay = require('razorpay');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not set in environment variables");
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async(req, res) => {
    try {
        console.log("📥 Incoming order request:", req.body);

        const { amount } = req.body;
        if (!amount) return res.status(400).json({ message: "Amount is required" });

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        console.log("✅ Razorpay order created:", order);
        res.json(order);
    } catch (err) {
        console.error("❌ Razorpay order creation failed:", err);
        res.status(500).json({
            message: "Order creation failed",
            error: err.error || err.message || "Unknown error"
        });
    }
};