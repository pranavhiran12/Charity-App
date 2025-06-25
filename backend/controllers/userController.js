const User = require('../models/User');

const getCurrentUser = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select('name email profilePic role');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error("❌ Error fetching current user:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    getCurrentUser
};