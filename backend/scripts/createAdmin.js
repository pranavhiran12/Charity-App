// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const Charity = require('../models/Charity');
const Guest = require('../models/Guest');
const Invitation = require('../models/Invitation');
const Payment = require('../models/Payment');
const Contribution = require('../models/Contribution');
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

async function createTestData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if we have any data
        const userCount = await User.countDocuments();
        const eventCount = await Event.countDocuments();
        const charityCount = await Charity.countDocuments();

        console.log(`📊 Current data counts: Users: ${userCount}, Events: ${eventCount}, Charities: ${charityCount}`);

        if (userCount === 0) {
            console.log('🔄 Creating test admin user...');
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'admin123',
                isVerified: true,
                role: 'admin'
            });
            await adminUser.save();
            console.log('✅ Admin user created');
        }

        if (charityCount === 0) {
            console.log('🔄 Creating test charity...');
            const testCharity = new Charity({
                name: 'Test Charity',
                description: 'A test charity for development',
                website: 'https://testcharity.com'
            });
            await testCharity.save();
            console.log('✅ Test charity created');
        }

        if (eventCount === 0) {
            console.log('🔄 Creating test event...');
            const adminUser = await User.findOne({ role: 'admin' });
            const testCharity = await Charity.findOne();

            const testEvent = new Event({
                host: adminUser._id,
                childName: 'Test Child',
                eventTitle: 'Test Birthday Party',
                eventDescription: 'A test birthday party',
                eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                time: '2:00 PM',
                venue: 'Test Venue',
                giftName: 'Test Gift',
                charity: {
                    name: testCharity.name,
                    description: testCharity.description,
                    charityId: testCharity._id
                },
                totalTargetAmount: 1000
            });
            await testEvent.save();
            console.log('✅ Test event created');
        }

        // Create some test guests
        const guestCount = await Guest.countDocuments();
        if (guestCount === 0) {
            console.log('🔄 Creating test guests...');
            const testEvent = await Event.findOne();
            const adminUser = await User.findOne({ role: 'admin' });

            const testGuest = new Guest({
                eventId: testEvent._id,
                name: 'Test Guest',
                email: 'guest@test.com',
                userId: adminUser._id,
                mobile: '1234567890'
            });
            await testGuest.save();
            console.log('✅ Test guest created');
        }

        // Create some test payments
        const paymentCount = await Payment.countDocuments();
        if (paymentCount === 0) {
            console.log('🔄 Creating test payments...');
            const testEvent = await Event.findOne();
            const testGuest = await Guest.findOne();

            const testPayment = new Payment({
                razorpayPaymentId: 'test_payment_123',
                razorpayOrderId: 'test_order_123',
                amount: 500,
                message: 'Test payment',
                eventId: testEvent._id,
                guestId: testGuest._id
            });
            await testPayment.save();
            console.log('✅ Test payment created');
        }

        console.log('🎉 Test data creation completed!');

        // Show final counts
        const finalUserCount = await User.countDocuments();
        const finalEventCount = await Event.countDocuments();
        const finalCharityCount = await Charity.countDocuments();
        const finalGuestCount = await Guest.countDocuments();
        const finalPaymentCount = await Payment.countDocuments();

        console.log(`📊 Final data counts:`);
        console.log(`Users: ${finalUserCount}`);
        console.log(`Events: ${finalEventCount}`);
        console.log(`Charities: ${finalCharityCount}`);
        console.log(`Guests: ${finalGuestCount}`);
        console.log(`Payments: ${finalPaymentCount}`);

    } catch (error) {
        console.error('❌ Error creating test data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

createTestData();

async function checkAndFixAdminUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find all users
        const users = await User.find();
        console.log(`📊 Found ${users.length} users:`);

        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Verified: ${user.isVerified}`);
        });

        // Find admin users
        const adminUsers = await User.find({ role: 'admin' });
        console.log(`👑 Found ${adminUsers.length} admin users:`);

        adminUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email})`);
        });

        // Check if the current user (admin@example.com) exists and has admin role
        const currentUser = await User.findOne({ email: 'admin@example.com' });
        if (currentUser) {
            console.log(`👤 Current user found: ${currentUser.name} (${currentUser.email}) - Role: ${currentUser.role}`);

            if (currentUser.role !== 'admin') {
                console.log('🔄 Updating user role to admin...');
                currentUser.role = 'admin';
                await currentUser.save();
                console.log('✅ User role updated to admin');
            }
        } else {
            console.log('❌ User admin@example.com not found');
        }

    } catch (error) {
        console.error('❌ Error checking admin users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

checkAndFixAdminUsers();