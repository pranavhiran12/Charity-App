const User = require('../models/User');
const Event = require('../models/Event');
const Contribution = require('../models/Contribution');
const Charity = require('../models/Charity');
const Guest = require('../models/Guest');
const Invitation = require('../models/Invitation');
const Payment = require('../models/Payment');

// Get all users
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

// Get all events
exports.getAllEvents = async(req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch events', error: err.message });
    }
};

// Get all contributions
exports.getAllContributions = async(req, res) => {
    try {
        const contributions = await Contribution.find()
            .populate('eventId')
            .sort({ createdAt: -1 });
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch contributions', error: err.message });
    }
};

// Get all charities
exports.getAllCharities = async(req, res) => {
    try {
        const charities = await Charity.find().sort({ createdAt: -1 });
        res.json(charities);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch charities', error: err.message });
    }
};

// Create a new charity
exports.createCharity = async(req, res) => {
    try {
        const { name, description, website, logoUrl } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name) return res.status(400).json({ message: 'Charity name is required' });

        const newCharity = new Charity({ name, description, website, logoUrl, image });
        await newCharity.save();

        res.status(201).json({ message: 'Charity created successfully', charity: newCharity });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create charity', error: err.message });
    }
};

// Update charity
exports.updateCharity = async(req, res) => {
    try {
        const { name, description, website, logoUrl } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const updateFields = { name, description, website, logoUrl };
        if (image) updateFields.image = image;

        const updated = await Charity.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updated) return res.status(404).json({ message: 'Charity not found' });

        res.json({ message: 'Charity updated successfully', charity: updated });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update charity', error: err.message });
    }
};

// Delete charity
exports.deleteCharity = async(req, res) => {
    try {
        const charity = await Charity.findByIdAndDelete(req.params.id);
        if (!charity) return res.status(404).json({ message: 'Charity not found' });

        res.json({ message: 'Charity deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete charity', error: err.message });
    }
};

// Delete user
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
};

// Delete event
exports.deleteEvent = async(req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete event', error: err.message });
    }
};

// Promote user to admin
exports.makeAdmin = async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, { role: 'admin' }, { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User promoted to admin', user });
    } catch (err) {
        res.status(500).json({ message: 'Failed to promote user', error: err.message });
    }
};

// Get dashboard statistics
exports.getDashboardStats = async(req, res) => {
    try {
        console.log('🔍 Admin dashboard stats requested by user:', req.user);

        // Check if user is admin
        if (!req.user || req.user.role !== 'admin') {
            console.log('❌ Access denied - User role:', req.user ? req.user.role : 'undefined');
            return res.status(403).json({ message: 'Admin access required' });
        }

        const [
            totalUsers,
            totalEvents,
            totalContributions,
            totalCharities,
            totalGuests,
            totalInvitations,
            totalPayments,
            verifiedUsers,
            pendingInvitations,
            acceptedInvitations,
            declinedInvitations
        ] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Contribution.countDocuments(),
            Charity.countDocuments(),
            Guest.countDocuments(),
            Invitation.countDocuments(),
            Payment.countDocuments(),
            User.countDocuments({ isVerified: true }),
            Invitation.countDocuments({ status: 'pending' }),
            Invitation.countDocuments({ status: 'accepted' }),
            Invitation.countDocuments({ status: 'declined' })
        ]);

        console.log('📊 Database counts:', {
            totalUsers,
            totalEvents,
            totalContributions,
            totalCharities,
            totalGuests,
            totalInvitations,
            totalPayments,
            verifiedUsers,
            pendingInvitations,
            acceptedInvitations,
            declinedInvitations
        });

        // Calculate total amount from payments
        const payments = await Payment.find();
        const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        console.log('💰 Total payments amount:', totalAmount);

        // Get recent activity
        const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
        const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);
        const recentContributions = await Contribution.find()
            .populate('eventId')
            .sort({ createdAt: -1 })
            .limit(5);

        console.log('👥 Recent users count:', recentUsers.length);
        console.log('📅 Recent events count:', recentEvents.length);
        console.log('💸 Recent contributions count:', recentContributions.length);

        const responseData = {
            counts: {
                totalUsers,
                totalEvents,
                totalContributions,
                totalCharities,
                totalGuests,
                totalInvitations,
                totalPayments,
                verifiedUsers,
                pendingInvitations,
                acceptedInvitations,
                declinedInvitations,
                totalAmount
            },
            recent: {
                users: recentUsers,
                events: recentEvents,
                contributions: recentContributions
            }
        };

        console.log('📤 Sending response:', responseData);
        res.json(responseData);
    } catch (err) {
        console.error('❌ Error in getDashboardStats:', err);
        res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
    }
};

// Test database connection and data
exports.testDatabase = async(req, res) => {
    try {
        console.log('🧪 Testing database connection...');

        // Test basic database operations
        const userCount = await User.countDocuments();
        const eventCount = await Event.countDocuments();
        const charityCount = await Charity.countDocuments();

        // Get a sample of data
        const sampleUser = await User.findOne();
        const sampleEvent = await Event.findOne();
        const sampleCharity = await Charity.findOne();

        const testResult = {
            connection: 'OK',
            counts: {
                users: userCount,
                events: eventCount,
                charities: charityCount
            },
            samples: {
                user: sampleUser ? { id: sampleUser._id, name: sampleUser.name, email: sampleUser.email } : null,
                event: sampleEvent ? { id: sampleEvent._id, title: sampleEvent.title } : null,
                charity: sampleCharity ? { id: sampleCharity._id, name: sampleCharity.name } : null
            }
        };

        console.log('✅ Database test result:', testResult);
        res.json(testResult);
    } catch (err) {
        console.error('❌ Database test failed:', err);
        res.status(500).json({ error: err.message });
    }
};