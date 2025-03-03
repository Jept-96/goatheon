/**
 * API Client
 * Handles communication with the backend API and Socket.io server
 */

const apiClient = {
  // Base URL for API requests
  baseUrl: 'http://localhost:3001/api',
  
  // Socket.io instance
  socket: null,
  
  // Initialize API client
  init: function() {
    // Connect to Socket.io server
    this.socket = io('http://localhost:3001');
    
    // Set up socket event listeners
    this.setupSocketListeners();
    
    return this;
  },
  
  // Set up socket event listeners
  setupSocketListeners: function() {
    // Listen for NFT claim events
    this.socket.on('nft-claimed', function(data) {
      console.log('NFT claimed:', data);
      
      // Update UI to show the NFT as claimed
      if (window.galleryUI) {
        galleryUI.updateNFTItem(data.id, 'claimed');
        galleryUI.updateCounters();
        
        // Show notification
        galleryUI.showNotification(`NFT #${data.id} has been claimed!`);
      }
      
      // Dispatch event for other components
      document.dispatchEvent(new CustomEvent('nft-claimed', { 
        detail: data
      }));
    });
    
    // Listen for NFT unlock events
    this.socket.on('nft-unlocked', function(data) {
      console.log('NFT unlocked:', data);
      
      // Update UI to show the NFT as unlocked
      if (window.galleryUI) {
        galleryUI.updateNFTItem(data.id, 'unlocked');
        
        // Show notification
        galleryUI.showNotification(`NFT #${data.id} has been unlocked! Be the first to claim it.`);
      }
      
      // Dispatch event for other components
      document.dispatchEvent(new CustomEvent('nft-unlocked', { 
        detail: data
      }));
    });
    
    // Listen for stats update events
    this.socket.on('stats-updated', function(data) {
      console.log('Stats updated:', data);
      
      // Update UI counters
      if (window.galleryUI) {
        galleryUI.updateCounters(data);
      }
    });
    
    // Listen for connection events
    this.socket.on('connect', function() {
      console.log('Connected to Socket.io server');
    });
    
    this.socket.on('disconnect', function() {
      console.log('Disconnected from Socket.io server');
    });
  },
  
  // Fetch all NFTs with pagination
  fetchNFTs: async function(page = 1, limit = 12) {
    try {
      const response = await fetch(`${this.baseUrl}/nfts?page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return null;
    }
  },
  
  // Fetch specific NFT details
  fetchNFT: async function(id) {
    try {
      const response = await fetch(`${this.baseUrl}/nfts/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching NFT:', error);
      return null;
    }
  },
  
  // Claim an NFT
  claimNFT: async function(id, contractAddress, claimedBy = 'Anonymous') {
    try {
      const response = await fetch(`${this.baseUrl}/nfts/${id}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractAddress,
          claimedBy
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error claiming NFT:', error);
      return { success: false, error: 'Network error' };
    }
  },
  
  // Fetch gallery statistics
  fetchStats: async function() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  },
  
  // Fetch market data for a contract
  fetchMarketData: async function(contractAddress) {
    try {
      const response = await fetch(`${this.baseUrl}/market/${contractAddress}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  },
  
  // Unlock an NFT (for testing)
  unlockNFT: async function(id) {
    try {
      const response = await fetch(`${this.baseUrl}/nfts/${id}/unlock`, {
        method: 'POST'
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error unlocking NFT:', error);
      return { success: false, error: 'Network error' };
    }
  }
};

// Initialize API client when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize API client
  const client = apiClient.init();
  
  // Export for use in other modules
  window.apiClient = client;
});
