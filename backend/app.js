const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes'); // ✅ correct

const charityRoutes = require('./routes/charityRoutes');
const guestRoutes = require('./routes/guestRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

console.log("🔵 app.js is loaded...");




app.get('/', (req, res) => {
    res.send('✅ App is working');
});


// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/charities', charityRoutes);
//app.use('/api/charities/:id', charityRoutes);


app.use('/api/guests', guestRoutes);
//app.use('/api/contributions', require('./routes/contribution'));
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contributions', contributionRoutes);

console.log("➡️ Registering invitation route");
app.use('/invitations', invitationRoutes);


app.post('/api/guests-debug', (req, res) => {
    res.json({ message: "🔥 POST /api/guests-debug hit" });
});


module.exports = app;

// backend/app.js
/*const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const guestRoutes = require('./routes/guestRoutes');

const app = express();
console.log("🔵 app.js is loaded...");

app.use(cors());
app.use(express.json()); // 🔥 Must be before routes

// Debug test route
app.post('/api/guests-debug', (req, res) => {
    res.json({ message: "🔥 POST /api/guests-debug hit" });
});

// Mount routes
app.use('/api/guests', guestRoutes);

module.exports = app;*/