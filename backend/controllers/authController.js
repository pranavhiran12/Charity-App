const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail');

// REGISTER
exports.registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase();
        console.log("🔍 Registering user with email:", normalizedEmail);

        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            console.warn("⚠️ Email already exists:", normalizedEmail);
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = jwt.sign({ email: normalizedEmail },
            process.env.JWT_SECRET, { expiresIn: '1d' }
        );

        const newUser = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            verificationToken,
            isVerified: false,
        });

        await newUser.save();
        await sendVerificationEmail(normalizedEmail, verificationToken);

        console.log("✅ User registered:", newUser._id);
        res.status(201).json({ message: "✅ Registration successful. Please verify your email." });
    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

// LOGIN
exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔐 Login attempt:", email);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.warn("❌ User not found for email:", normalizedEmail);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("👤 Found user:", user.email, "| Hashed password:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        console.log("🔍 Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            console.warn("❌ Incorrect password for email:", normalizedEmail);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (!user.isVerified) {
            console.warn("⚠️ Unverified email login attempt:", normalizedEmail);
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        const token = jwt.sign({ id: user._id, email: user.email },
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );

        console.log("✅ Login successful for:", user.email);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic || null,
            },
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// EMAIL VERIFICATION
exports.verifyEmail = async(req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📧 Email verification for:", decoded.email);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            console.warn("❌ No user found for verification:", decoded.email);
            return res.redirect('http://localhost:5173/verified?error=invalid');
        }

        if (user.isVerified) {
            return res.redirect('http://localhost:5173/verified?already=true');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        console.log("✅ Email verified:", user.email);
        res.redirect('http://localhost:5173/verified?success=true');
    } catch (err) {
        console.error("❌ Email verification failed:", err);
        res.redirect('http://localhost:5173/verified?error=invalid');
    }
};