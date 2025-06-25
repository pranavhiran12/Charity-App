const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("🔐 Incoming Authorization Header:", authHeader); // ✅ Add this line

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.split('.').length !== 3) {
        return res.status(401).json({ message: 'JWT malformed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded:", decoded); // ✅ Add this line

        // 🔍 Try to fetch user from DB
        let user = await User.findById(decoded._id || decoded.id);

        // 🛑 If not found, fallback to token data (for guest users)
        if (!user && decoded.email) {
            user = {
                _id: decoded.id || null,
                email: decoded.email,
                name: decoded.name || "Guest User",
                role: decoded.role || "guest",
            };
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // ✅ Attach user to req
        req.user = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        console.log("🔓 Authenticated user:", req.user); // ✅ Add this line

        next();
    } catch (err) {
        console.error('❌ Auth Error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;