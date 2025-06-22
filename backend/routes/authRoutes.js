const router = require('express').Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
require('dotenv').config();

// 🧠 Traditional Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);

// 🔐 JWT Generator
const createJWT = (user) => {
    return jwt.sign({ id: user._id, email: user.email },
        process.env.JWT_SECRET, { expiresIn: '7d' }
    );
};

// 🔗 Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const token = createJWT(req.user);
        const name = encodeURIComponent(req.user.name || '');
        const profilePic = encodeURIComponent(req.user.profilePic || '');
        res.redirect(`http://localhost:5173/oauth-success?token=${token}&name=${name}&profilePic=${profilePic}`);
    }
);

module.exports = router;