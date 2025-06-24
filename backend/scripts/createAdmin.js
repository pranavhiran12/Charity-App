// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin(force = false) {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'admin@example.com';
    const existing = await User.findOne({ email });

    if (existing && !force) {
        return console.log('❌ Admin already exists');
    }

    if (existing && force) {
        await User.deleteOne({ email });
        console.log("⚠️ Existing admin deleted");
    }

    const hashed = await bcrypt.hash('admin123', 12);
    const admin = new User({
        name: 'Admin User',
        email,
        password: hashed,
        isVerified: true,
        role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin created');
    process.exit();
}

const force = process.argv.includes('--force');
createAdmin(force);