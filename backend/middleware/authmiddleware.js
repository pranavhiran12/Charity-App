const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ensure you have this



const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id || decoded.id);
        if (!user) return res.status(401).json({ message: 'User not found' });

        // ✅ Make sure `req.user._id` is always set
        // req.user = { _id: user._id }; // or req.user = user if you need more fields
        req.user = { _id: user._id, id: user._id }; // ✅ now both id and _id will work

        next();
    } catch (err) {
        console.error('Auth Error:', err);
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;