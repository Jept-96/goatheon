const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['locked', 'unlocked', 'claimed'],
    default: 'locked'
  },
  unlockTime: {
    type: Date,
    default: null
  },
  contractAddress: {
    type: String,
    default: null
  },
  claimedBy: {
    type: String,
    default: null
  },
  claimedDate: {
    type: Date,
    default: null
  },
  marketCap: {
    type: Number,
    default: null
  },
  volume24h: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  dataSource: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NFT', nftSchema);
