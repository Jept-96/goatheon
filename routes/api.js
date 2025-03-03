const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const NFT = require('../models/nft');

// Get all NFTs with pagination
router.get('/nfts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, use fallback data from nft-data.json
      try {
        const fs = require('fs');
        const nftData = JSON.parse(fs.readFileSync('./nft-data.json', 'utf-8'));
        
        // Apply pagination
        const nfts = nftData.slice(skip, skip + limit).map(nft => ({
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
        
        const total = nftData.length;
        
        return res.json({
          nfts,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total,
          source: 'fallback'
        });
      } catch (fallbackErr) {
        console.error('Error using fallback data:', fallbackErr);
        return res.status(500).json({ error: 'Database unavailable and fallback failed' });
      }
    }
    
    // MongoDB is connected, use it
    const nfts = await NFT.find().skip(skip).limit(limit);
    const total = await NFT.countDocuments();
    
    res.json({
      nfts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      source: 'database'
    });
  } catch (err) {
    console.error('Error fetching NFTs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific NFT details
router.get('/nfts/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, use fallback data from nft-data.json
      try {
        const fs = require('fs');
        const nftData = JSON.parse(fs.readFileSync('./nft-data.json', 'utf-8'));
        
        const nftJson = nftData.find(nft => nft.id === parseInt(req.params.id));
        
        if (!nftJson) {
          return res.status(404).json({ error: 'NFT not found' });
        }
        
        const nft = {
          id: nftJson.id,
          title: nftJson.title,
          description: nftJson.description,
          image: `assets/images/gallery/${nftJson.id}.png`,
          status: 'locked',
          unlockTime: null,
          contractAddress: null,
          claimedBy: null,
          claimedDate: null,
          marketCap: null,
          volume24h: null,
          price: null,
          dataSource: null,
          source: 'fallback'
        };
        
        return res.json(nft);
      } catch (fallbackErr) {
        console.error('Error using fallback data:', fallbackErr);
        return res.status(500).json({ error: 'Database unavailable and fallback failed' });
      }
    }
    
    // MongoDB is connected, use it
    const nft = await NFT.findOne({ id: parseInt(req.params.id) });
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    res.json({...nft.toObject(), source: 'database'});
  } catch (err) {
    console.error('Error fetching NFT:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Claim an NFT
router.post('/nfts/:id/claim', async (req, res) => {
  try {
    const { contractAddress, claimedBy } = req.body;
    
    if (!contractAddress) {
      return res.status(400).json({ error: 'Contract address is required' });
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, we can't persist the claim
      // But we can still emit the socket event for real-time updates
      const io = req.app.get('io');
      const nftId = parseInt(req.params.id);
      
      io.emit('nft-claimed', {
        id: nftId,
        contractAddress,
        claimedBy: claimedBy || 'Anonymous'
      });
      
      // Create a mock NFT object for the response
      const mockNft = {
        id: nftId,
        status: 'claimed',
        contractAddress,
        claimedBy: claimedBy || 'Anonymous',
        claimedDate: new Date(),
        source: 'memory-only'
      };
      
      return res.json({ 
        success: true, 
        nft: mockNft,
        warning: 'Database unavailable. This claim will not be persisted after server restart.'
      });
    }
    
    // MongoDB is connected, use it
    const nft = await NFT.findOne({ id: parseInt(req.params.id) });
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    if (nft.status !== 'unlocked') {
      return res.status(400).json({ error: 'NFT is not available for claiming' });
    }
    
    // Update NFT status
    nft.status = 'claimed';
    nft.contractAddress = contractAddress;
    nft.claimedBy = claimedBy || 'Anonymous';
    nft.claimedDate = new Date();
    
    await nft.save();
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('nft-claimed', {
      id: nft.id,
      contractAddress,
      claimedBy: nft.claimedBy
    });
    
    res.json({ success: true, nft: {...nft.toObject(), source: 'database'} });
  } catch (err) {
    console.error('Error claiming NFT:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get gallery statistics
router.get('/stats', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, use fallback data
      try {
        const fs = require('fs');
        const nftData = JSON.parse(fs.readFileSync('./nft-data.json', 'utf-8'));
        
        // In fallback mode, we assume all NFTs are locked (not claimed)
        const total = nftData.length;
        const claimed = 0;
        const remaining = total;
        
        return res.json({
          total,
          claimed,
          remaining,
          source: 'fallback'
        });
      } catch (fallbackErr) {
        console.error('Error using fallback data:', fallbackErr);
        return res.status(500).json({ error: 'Database unavailable and fallback failed' });
      }
    }
    
    // MongoDB is connected, use it
    const total = await NFT.countDocuments();
    const claimed = await NFT.countDocuments({ status: 'claimed' });
    const remaining = total - claimed;
    
    res.json({
      total,
      claimed,
      remaining,
      source: 'database'
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get market data for a contract
router.get('/market/:contractAddress', async (req, res) => {
  try {
    const { contractAddress } = req.params;
    
    // In a real implementation, you would fetch data from an API
    // For now, we'll generate mock data
    const marketData = {
      contractAddress,
      price: Math.random() * 10,
      marketCap: Math.floor(Math.random() * 1000000) + 10000,
      volume24h: Math.floor(Math.random() * 100000) + 1000,
      source: 'Mock API'
    };
    
    res.json(marketData);
  } catch (err) {
    console.error('Error fetching market data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unlock an NFT (for testing)
router.post('/nfts/:id/unlock', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, we can't persist the unlock
      // But we can still emit the socket event for real-time updates
      const io = req.app.get('io');
      const nftId = parseInt(req.params.id);
      const unlockTime = new Date();
      
      io.emit('nft-unlocked', {
        id: nftId,
        unlockTime
      });
      
      // Create a mock NFT object for the response
      const mockNft = {
        id: nftId,
        status: 'unlocked',
        unlockTime,
        source: 'memory-only'
      };
      
      return res.json({ 
        success: true, 
        nft: mockNft,
        warning: 'Database unavailable. This unlock will not be persisted after server restart.'
      });
    }
    
    // MongoDB is connected, use it
    const nft = await NFT.findOne({ id: parseInt(req.params.id) });
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    if (nft.status !== 'locked') {
      return res.status(400).json({ error: 'NFT is already unlocked or claimed' });
    }
    
    // Update NFT status
    nft.status = 'unlocked';
    nft.unlockTime = new Date();
    
    await nft.save();
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('nft-unlocked', {
      id: nft.id,
      unlockTime: nft.unlockTime
    });
    
    res.json({ success: true, nft: {...nft.toObject(), source: 'database'} });
  } catch (err) {
    console.error('Error unlocking NFT:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
