const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./routes/api');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the current directory

// Connect to MongoDB (using MongoDB Atlas or local fallback)
// For MongoDB Atlas, set MONGO_URI in .env file
// Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nft-gallery';
console.log(`Attempting to connect to MongoDB at: ${MONGO_URI.includes('@') ? MONGO_URI.split('@')[0].split('//')[0] + '//' + MONGO_URI.split('@')[0].split('//')[1].split(':')[0] + ':****@' + MONGO_URI.split('@')[1] : MONGO_URI}`);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing without database connection. Some features may not work.');
  });

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Log all events for debugging
  socket.onAny((event, ...args) => {
    console.log(`Socket event: ${event}`, args);
  });
  
  // Send a welcome message to the client
  socket.emit('welcome', { message: 'Welcome to the NFT Gallery server!' });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api', apiRoutes);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
