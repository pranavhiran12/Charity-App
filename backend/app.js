const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/auth'); // optional
const charityRoutes = require('./routes/charityRoutes');
const guestRoutes = require('./routes/guest');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/charities/:id', charityRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/contributions', require('./routes/contribution'));
app.use('/api/dashboard', require('./routes/dashboard'));

module.exports = app;