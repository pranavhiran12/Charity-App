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
const contributionRoutes = require('./routes/contributionRoutes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/charities', charityRoutes); // ✅ This is enough
//app.use('/api/charities/:id', charityRoutes);

console.log("Registering /api/guests...");
app.use('/api/guests', guestRoutes);
app.use('/api/contributions', contributionRoutes);



module.exports = app;