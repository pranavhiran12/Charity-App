const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const sendEmail = require("../utils/sendEmail");

const { sendEmail, sendVerificationEmail } = require('../utils/sendEmail'); // adjust path

exports.registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const newUser = new User({
            name,
            email,
            password,
            verificationToken,
            isVerified: false,
        });

        await newUser.save();

        const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

        const message = `Hi ${name},\n\nPlease verify your email by clicking the link below:\n${verificationLink}\n\nThank you!`;

        await sendEmail(email, "Verify your TwoPresents account", message);

        res.status(201).json({ message: "Registration successful. Please check your email to verify your account." });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password || '');
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_secret_key');

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};