const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password'); // optionally exclude password

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // ✅ Attach the full user (including role) to request
        req.user = {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        };

        next();
    } catch (err) {
        console.error('Auth Error:', err.message);
        return res.status(403).json({ message: "Forbidden" });
    }
};

module.exports = authMiddleware;