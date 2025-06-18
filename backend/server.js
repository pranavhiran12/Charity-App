const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const { Server } = require('socket.io');
const app = require('./app');

// Load environment variables
dotenv.config();

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO
/*const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE"],
        credentials: true
    }
});

// Attach io to app
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('joinEventRoom', (eventId) => {
        socket.join(eventId);
        console.log(`📢 Joined event room: ${eventId}`);
    });

    socket.on('leaveEventRoom', (eventId) => {
        socket.leave(eventId);
        console.log(`🚪 Left event room: ${eventId}`);
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
    });
}); */

// Connect to MongoDB before starting the server
mongoose.connect(process.env.MONGO_URI
        // useNewUrlParser: true,
        //useUnifiedTopology: true
    )
    .then(() => {
        console.log('✅ MongoDB connected');
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // Exit process if DB connection fails
    });