const router = require('express').Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
require('dotenv').config();

// Traditional email/password
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);

// Helper to generate token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email },
        process.env.JWT_SECRET, { expiresIn: '1d' }
    );
};




// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {

        console.log("✅ Google callback reached.");
        console.log("User:", req.user);
        if (!req.user) {
            return res.redirect('http://localhost:5173/login?error=OAuthFailed');
        }

        const token = generateToken(req.user);
        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('http://localhost:5173/login?error=OAuthFailed');
        }

        const token = generateToken(req.user);
        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
);



module.exports = router;