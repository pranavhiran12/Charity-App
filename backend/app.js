const express = require('express');
const app = express();
const session = require("express-session");
const passport = require("passport");

const cors = require('cors');


require("dotenv").config();
require("./config/passport"); // Load passport strategies



// ✅ Middleware
app.use(cors({
    origin: "http://localhost:5173", // React frontend origin
    credentials: true // Required for cookies/session
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Express session
app.use(session({
    secret: process.env.SESSION_SECRET || "mysecret", // store in .env
    resave: false,
    saveUninitialized: false
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const charityRoutes = require('./routes/charityRoutes');
const guestRoutes = require('./routes/guestRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ✅ Health check
app.get('/', (req, res) => {
    res.send('✅ App is working');
});

// ✅ API route mounting
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/invitations', invitationRoutes);

// Debug/test route
app.post('/api/guests-debug', (req, res) => {
    res.json({ message: "🔥 POST /api/guests-debug hit" });
});

module.exports = app;