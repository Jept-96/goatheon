/**
 * NFT Gallery Claim System
 * Handles the claiming functionality for NFTs
 * Updated to use API client instead of localStorage
 */

// Claim system
const galleryClaim = {
    // Claim state
    state: {
        pendingClaims: {},
        claimHistory: []
    },
    
    // Initialize claim system
    init: function() {
        // Set up event listeners
        this.setupEventListeners();
        
        return this;
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Listen for redirect button clicks
        document.addEventListener('click', (event) => {
            if (event.target.id === 'redirect-button') {
                this.handleRedirect(event);
            }
        });
        
        // Listen for contract address submissions
        document.addEventListener('click', (event) => {
            if (event.target.id === 'submit-contract') {
                this.handleContractSubmission();
            }
        });
        
        // Listen for contract input keypress (Enter key)
        document.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && document.activeElement.id === 'contract-address-input') {
                this.handleContractSubmission();
            }
        });
        
        // Listen for NFT claims from Socket.io
        document.addEventListener('nft-claimed', (event) => {
            // Add to claim history
            this.addToClaimHistory(event.detail.id, event.detail.contractAddress);
            
            // Fetch market cap for the claimed NFT
            this.fetchMarketCap(event.detail.id, event.detail.contractAddress);
        });
    },
    
    // Handle redirect to pump.fun
    handleRedirect: function(event) {
        // Get active NFT ID from modal
        const activeNFTId = galleryUI.state.activeModal;
        if (!activeNFTId) return;
        
        // Get NFT data
        const nft = galleryData.getNFT(activeNFTId);
        if (!nft) return;
        
        // Add to pending claims
        this.state.pendingClaims[activeNFTId] = {
            timestamp: new Date().getTime(),
            status: 'pending'
        };
        
        // Let the default link behavior happen (redirect to pump.fun)
    },
    
    // Handle contract address submission
    handleContractSubmission: async function() {
        // Get active NFT ID from modal
        const activeNFTId = galleryUI.state.activeModal;
        if (!activeNFTId) return;
        
        // Get NFT data
        const nft = await galleryData.getNFT(activeNFTId);
        if (!nft || nft.status !== 'unlocked') return;
        
        // Get contract address input
        const contractInput = document.getElementById('contract-address-input');
        if (!contractInput) return;
        
        const contractAddress = contractInput.value.trim();
        
        // Validate contract address
        if (!this.validateContractAddress(contractAddress)) {
            galleryUI.showNotification('Please enter a valid Solana contract address', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = document.getElementById('submit-contract');
        if (submitButton) {
            submitButton.textContent = 'SUBMITTING...';
            submitButton.disabled = true;
        }
        
        try {
            // Claim the NFT using API client if available
            let success = false;
            
            if (window.apiClient) {
                // Use API client
                const result = await apiClient.claimNFT(activeNFTId, contractAddress);
                success = result && result.success;
            } else {
                // Fallback to local implementation
                success = await galleryData.claimNFT(activeNFTId, contractAddress);
            }
            
            if (success) {
                // Update pending claim status
                if (this.state.pendingClaims[activeNFTId]) {
                    this.state.pendingClaims[activeNFTId].status = 'claimed';
                }
                
                // Show success notification
                galleryUI.showNotification('NFT claimed successfully!', 'success');
                
                // Fetch market data
                this.fetchMarketCap(activeNFTId, contractAddress);
            } else {
                // Show error notification
                galleryUI.showNotification('Failed to claim NFT. It may already be claimed.', 'error');
            }
        } catch (error) {
            console.error('Error claiming NFT:', error);
            galleryUI.showNotification('Error claiming NFT. Please try again.', 'error');
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.textContent = 'SUBMIT';
                submitButton.disabled = false;
            }
        }
    },
    
    // Validate Solana contract address
    validateContractAddress: function(address) {
        // Basic validation for Solana address
        // Solana addresses are base58 encoded and typically 32-44 characters long
        if (!address || typeof address !== 'string') return false;
        
        // Check length
        if (address.length < 32 || address.length > 44) return false;
        
        // Check for valid base58 characters (alphanumeric without 0, O, I, l)
        const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
        return base58Regex.test(address);
    },
    
    // Add to claim history
    addToClaimHistory: function(id, contractAddress) {
        this.state.claimHistory.push({
            id,
            contractAddress,
            timestamp: new Date().getTime()
        });
        
        // Limit history to last 50 claims
        if (this.state.claimHistory.length > 50) {
            this.state.claimHistory = this.state.claimHistory.slice(-50);
        }
    },
    
    // Fetch market data for a claimed NFT
    fetchMarketCap: async function(id, contractAddress) {
        // Show loading state
        const mcapElement = document.getElementById('claimed-mcap');
        const priceElement = document.getElementById('claimed-price');
        const volumeElement = document.getElementById('claimed-volume');
        const sourceElement = document.getElementById('data-source');
        
        if (mcapElement) mcapElement.textContent = 'Loading...';
        if (priceElement) priceElement.textContent = 'Loading...';
        if (volumeElement) volumeElement.textContent = 'Loading...';
        if (sourceElement) sourceElement.textContent = '';
        
        try {
            let marketData;
            
            // Try to use API client first
            if (window.apiClient) {
                marketData = await apiClient.fetchMarketData(contractAddress);
            }
            
            // Fallback to market-data.js if API client failed or is not available
            if (!marketData && window.marketData) {
                marketData = await marketData.getTokenData(contractAddress);
            }
            
            // If we have market data, update the NFT
            if (marketData) {
                // Update NFT with all metrics
                await galleryData.updateMarketData(id, marketData);
                
                console.log(`Market data for NFT #${id} (${contractAddress}):`, marketData);
            } else {
                // Fallback to simulation if no market data is available
                console.log('No market data available, using simulation');
                
                // Generate random market cap between $5,000 and $105,000
                const marketCap = Math.floor(Math.random() * 100000) + 5000;
                const volume = Math.floor(marketCap * (Math.random() * 0.2 + 0.05)); // 5-25% of market cap
                const price = (marketCap / 1000000) * (Math.random() * 0.5 + 0.5); // Simulated price
                
                // Update NFT market data
                await galleryData.updateMarketData(id, {
                    marketCap: marketCap,
                    volume24h: volume,
                    price: price,
                    source: 'Simulation'
                });
                
                console.log(`Simulated market data for NFT #${id} (${contractAddress}): $${marketCap.toLocaleString()} mcap, $${volume.toLocaleString()} volume`);
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
            
            // Update UI with error state
            if (mcapElement) mcapElement.textContent = 'N/A';
            if (priceElement) priceElement.textContent = 'N/A';
            if (volumeElement) volumeElement.textContent = 'N/A';
            if (sourceElement) sourceElement.textContent = 'Error';
        }
    },
    
    // Get pending claims
    getPendingClaims: function() {
        return this.state.pendingClaims;
    },
    
    // Get claim history
    getClaimHistory: function() {
        return this.state.claimHistory;
    }
};

// Initialize claim system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize claim system
    const claim = galleryClaim.init();
    
    // Export for use in other modules
    window.galleryClaim = claim;
});
