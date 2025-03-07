const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./routes/api');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
cors: {
origin: "*",
methods: ["GET", "POST"]
}
});

// Global timer state
const globalTimer = {
isRunning: false,
startTime: null,
nextUnlockTime: null,
nextUnlockId: 1,
previewMode: false,
isLaunched: false,
launchDate: null,
intervals: {
batch1: 15 * 60 * 1000,  // 1-10: 15 minutes
batch2: 30 * 60 * 1000,  // 11-20: 30 minutes
batch3: 45 * 60 * 1000,  // 21-30: 45 minutes
batch4: 60 * 60 * 1000,  // 31-40: 1 hour
batch5: 75 * 60 * 1000,  // 41-50: 1 hour 15 minutes
batch6: 90 * 60 * 1000,  // 51-60: 1 hour 30 minutes
batch7: 105 * 60 * 1000, // 61-70: 1 hour 45 minutes
batch8: 120 * 60 * 1000, // 71-80: 2 hours
batch9: 135 * 60 * 1000, // 81-90: 2 hours 15 minutes
batch10: 150 * 60 * 1000, // 91-100: 2 hours 30 minutes
batch11: 165 * 60 * 1000  // 101-102: 2 hours 45 minutes
}
};

// Helper function to get interval for NFT based on its ID
function getIntervalForNFT(id) {
if (id <= 10) return globalTimer.intervals.batch1;
if (id <= 20) return globalTimer.intervals.batch2;
if (id <= 30) return globalTimer.intervals.batch3;
if (id <= 40) return globalTimer.intervals.batch4;
if (id <= 50) return globalTimer.intervals.batch5;
if (id <= 60) return globalTimer.intervals.batch6;
if (id <= 70) return globalTimer.intervals.batch7;
if (id <= 80) return globalTimer.intervals.batch8;
if (id <= 90) return globalTimer.intervals.batch9;
if (id <= 100) return globalTimer.intervals.batch10;
return globalTimer.intervals.batch11;
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
console.error('MongoDB connection error:', err);
console.log('Continuing without database connection. Some features may not work.');
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Custom route for admin
app.get('/admin', (req, res) => {
res.sendFile(path.join(__dirname, 'admin', 'admin-xyz123.html'));
});

// URL rewriting middleware for other routes
app.get(['/', '/home', '/loading', '/gallery'], (req, res) => {
const urlMap = {
'/': 'loading.html',
'/home': 'home.html',
'/loading': 'loading.html',
'/gallery': 'gallery.html'
};

const filePath = path.join(__dirname, urlMap[req.path]);
res.sendFile(filePath);
});

// Socket.io connection handling
io.on('connection', (socket) => {
console.log('Client connected:', socket.id);

// Send current timer state to new client
socket.emit('timerState', globalTimer);

// Preview mode toggle
socket.on('togglePreview', (enabled) => {
    console.log('Preview mode:', enabled);
    globalTimer.previewMode = enabled;
    io.emit('timerStateChanged', globalTimer);
});

// Launch state change
socket.on('setLaunchState', (data) => {
    console.log('Launch state:', data);
    globalTimer.isLaunched = data.isLaunched;
    globalTimer.launchDate = data.launchDate;

    if (!data.isLaunched) {
        // Reset timer when stopping
        globalTimer.isRunning = false;
        globalTimer.startTime = null;
        globalTimer.nextUnlockTime = null;
        globalTimer.nextUnlockId = 1;
    } else {
        // Start timer
        const now = Date.now();
        globalTimer.isRunning = true;
        globalTimer.startTime = now;
        globalTimer.nextUnlockTime = now + getIntervalForNFT(1);
        globalTimer.nextUnlockId = 1;
    }

    io.emit('timerStateChanged', globalTimer);
});

// Handle NFT unlocks
socket.on('nftUnlocked', (data) => {
    if (globalTimer.isRunning) {
        globalTimer.nextUnlockId = data.nextId;
        if (globalTimer.nextUnlockId <= 102) { // Total NFTs
            const now = Date.now();
            globalTimer.nextUnlockTime = now + getIntervalForNFT(globalTimer.nextUnlockId);
        } else {
            globalTimer.isRunning = false;
            globalTimer.nextUnlockTime = null;
        }
        io.emit('timerStateChanged', globalTimer);
    }
});

// Handle request for current state
socket.on('requestState', () => {
    socket.emit('timerState', globalTimer);
});

socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
});
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api', apiRoutes);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}/`);
console.log('Access points:');
console.log(`http://localhost:${PORT}/ -> Loading page`);
console.log(`http://localhost:${PORT}/home -> Home page`);
console.log(`http://localhost:${PORT}/gallery -> Gallery page`);
console.log(`http://localhost:${PORT}/admin -> Admin page`);
});
