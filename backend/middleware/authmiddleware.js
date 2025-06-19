const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    // ✅ Proper optional chaining and JWT structure check
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No or invalid token format' });
    }


    const token = authHeader.split(' ')[1];
    if (!token || token.split('.').length !== 3) {
        return res.status(401).json({ message: 'JWT malformed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id || decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = { _id: user._id };
        next();
    } catch (err) {
        console.error('Auth Error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;