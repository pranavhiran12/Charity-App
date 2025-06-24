const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail');

// 📩 REGISTER USER
exports.registerUser = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });

        if (existing) {
            console.warn("⚠️ Email already registered:", normalizedEmail);
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
            role: role === 'admin' ? 'admin' : 'user' // Secure role assignment
        });

        await newUser.save();
        await sendVerificationEmail(normalizedEmail, verificationToken);

        console.log("✅ Registered:", normalizedEmail);
        res.status(201).json({ message: "✅ Registration successful. Please verify your email." });
    } catch (err) {
        console.error("❌ Registration error:", err.message);
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

// 🔐 LOGIN USER
// 🔐 LOGIN
exports.loginUser = async(req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log("📤 Login request for:", email, "| Role expected:", role);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password || "");
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const requestedAdmin = role && role.toLowerCase() === "admin";
        const actualAdmin = user.role && user.role.toLowerCase() === "admin";

        console.log("🛂 role from req.body:", role);
        console.log("🧾 user.role from DB:", user.role);

        if (requestedAdmin && !actualAdmin) {
            console.warn("🚫 Unauthorized admin login attempt:", user.email);
            return res.status(403).json({ error: "Not authorized as admin" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user",
                profilePic: user.profilePic || null,
            },
        });
    } catch (err) {
        console.error("❌ Login error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ VERIFY EMAIL
exports.verifyEmail = async(req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            console.warn("❌ Invalid verification token:", decoded.email);
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
        console.error("❌ Email verification failed:", err.message);
        res.redirect('http://localhost:5173/verified?error=invalid');
    }
};