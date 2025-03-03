const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const NFT = require('./models/nft');

// Load environment variables
dotenv.config();

// Connect to MongoDB (using MongoDB Atlas or local fallback)
// For MongoDB Atlas, set MONGO_URI in .env file
// Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nft-gallery';
console.log(`Attempting to connect to MongoDB at: ${MONGO_URI.includes('@') ? MONGO_URI.split('@')[0].split('//')[0] + '//' + MONGO_URI.split('@')[0].split('//')[1].split(':')[0] + ':****@' + MONGO_URI.split('@')[1] : MONGO_URI}`);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Cannot import data without a database connection. Please check your MongoDB connection.');
    process.exit(1);
  });

// Import NFT data
const importData = async () => {
  try {
    // Read NFT data from JSON file
    const nftData = JSON.parse(fs.readFileSync('./nft-data.json', 'utf-8'));
    
    // Clear existing data
    await NFT.deleteMany({});
    console.log('Existing NFT data cleared');
    
    // Transform data to match schema
    const nfts = nftData.map(nft => ({
      id: nft.id,
      title: nft.title,
      description: nft.description,
      image: `assets/images/gallery/${nft.id}.png`,
      status: 'locked',
      unlockTime: null,
      contractAddress: null,
      claimedBy: null,
      claimedDate: null,
      marketCap: null,
      volume24h: null,
      price: null,
      dataSource: null
    }));
    
    // Insert data
    await NFT.insertMany(nfts);
    console.log(`${nfts.length} NFTs imported successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
