const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();


console.log("🟢 server.js is running...");

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(5000, () => {
            console.log('🚀 Server running on http://localhost:5000');
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));

/*
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(5000, () => {
            console.log('🚀 Server running at http://localhost:5000');
        });
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));*/


// backend/server.js
/*const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://127.0.0.1:27017/twopresents', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});*/