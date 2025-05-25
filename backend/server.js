const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(5000, () => {
            console.log('🚀 Server running on http://localhost:5000');
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));