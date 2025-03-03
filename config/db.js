const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For MongoDB Atlas, set MONGO_URI in .env file
    // Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nft-gallery';
    console.log(`Attempting to connect to MongoDB at: ${MONGO_URI.includes('@') ? MONGO_URI.split('@')[0].split('//')[0] + '//' + MONGO_URI.split('@')[0].split('//')[1].split(':')[0] + ':****@' + MONGO_URI.split('@')[1] : MONGO_URI}`);
    
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Continuing without database connection. Some features may not work.');
    return null;
  }
};

module.exports = connectDB;
