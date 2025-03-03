/**
 * NFT Gallery Data
 * Contains data for all NFTs in the gallery
 * Updated to use API client instead of localStorage
 */

// NFT data structure
const nftData = {
    // Total number of NFTs
    totalNFTs: 102,
    
    // Counter for claimed NFTs
    claimedCount: 0,
    
    // NFT items array
    items: [],
    
    // Stats
    stats: {
        total: 102,
        claimed: 0,
        remaining: 102
    },
    
    // Initialize NFT data
    init: async function() {
        // If API client is not available, load fallback data immediately
        if (!window.apiClient) {
            console.warn('API client not available, loading fallback data...');
            await this.loadFallbackData();
            return this;
        }
        
        try {
            // Fetch stats first
            const stats = await apiClient.fetchStats();
            if (stats) {
                this.stats = stats;
                this.claimedCount = stats.claimed;
                this.totalNFTs = stats.total;
                
                // Update UI counters
                this.updateCounters();
            }
            
            // Fetch first page of NFTs
            const data = await apiClient.fetchNFTs(1, 12);
            if (data && data.nfts) {
                this.items = data.nfts;
                console.log('Loaded NFT data from API');
            } else {
                console.warn('Failed to load NFT data from API, using fallback');
                await this.loadFallbackData();
            }
        } catch (error) {
            console.error('Error initializing NFT data:', error);
            await this.loadFallbackData();
        }
        
        return this;
    },
    
    // Load fallback data from nft-data.json
    loadFallbackData: async function() {
        try {
            console.log('Loading fallback data from nft-data.json...');
            const response = await fetch('nft-data.json');
            if (!response.ok) {
                throw new Error(`Failed to load nft-data.json: ${response.status} ${response.statusText}`);
            }
            
            const jsonData = await response.json();
            
            if (!Array.isArray(jsonData) || jsonData.length === 0) {
                throw new Error('Invalid JSON format: expected a non-empty array');
            }
            
            // Process each NFT in the JSON data
            this.items = jsonData.map(nftData => ({
                id: nftData.id,
                title: nftData.title || `NFT #${nftData.id}`,
                description: nftData.description || `This is NFT #${nftData.id}`,
                image: `assets/images/gallery/${nftData.id}.png`,
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
            
            console.log(`Loaded fallback NFT data from nft-data.json: ${this.items.length} items`);
            
            // Debug: Log the first item
            if (this.items.length > 0) {
                console.log('First item:', JSON.stringify(this.items[0]));
            }
            
            // Make sure the items are accessible to other components
            window.galleryData = this;
        } catch (error) {
            console.error('Error loading fallback data:', error);
            this.generateDefaultData();
        }
    },
    
    // Generate default data
    generateDefaultData: function() {
        console.log('Generating default NFT data');
        
        // Clear items array
        this.items = [];
        
        // Generate placeholder data for 102 NFTs
        for (let i = 1; i <= this.totalNFTs; i++) {
            this.items.push({
                id: i,
                title: `NFT #${i}`,
                description: `This is a unique NFT with ID ${i}. Each NFT has its own story and characteristics.`,
                image: `assets/images/gallery/${i}.png`,
                status: 'locked',
                unlockTime: null,
                contractAddress: null,
                claimedBy: null,
                claimedDate: null,
                marketCap: null,
                volume24h: null,
                price: null,
                dataSource: null
            });
        }
    },
    
    // Update counters in UI
    updateCounters: function(stats) {
        if (stats) {
            this.stats = stats;
            this.claimedCount = stats.claimed;
            this.totalNFTs = stats.total;
        }
        
        // Update UI elements
        const totalElement = document.getElementById('total-count');
        const claimedElement = document.getElementById('claimed-count');
        const remainingElement = document.getElementById('remaining-count');
        
        if (totalElement) totalElement.textContent = this.stats.total;
        if (claimedElement) claimedElement.textContent = this.stats.claimed;
        if (remainingElement) remainingElement.textContent = this.stats.remaining;
    },
    
    // Get NFT by ID
    getNFT: async function(id) {
        // If we don't have any items yet, load fallback data
        if (this.items.length === 0) {
            await this.loadFallbackData();
        }
        
        // Check if we already have this NFT in memory
        const cachedNFT = this.items.find(item => item.id === id);
        
        // If we have it and it's complete, return it
        if (cachedNFT && cachedNFT.title) {
            return cachedNFT;
        }
        
        // Otherwise, fetch from API
        try {
            if (window.apiClient) {
                const nft = await apiClient.fetchNFT(id);
                if (nft) {
                    // Update cache
                    const index = this.items.findIndex(item => item.id === id);
                    if (index >= 0) {
                        this.items[index] = nft;
                    } else {
                        this.items.push(nft);
                    }
                    return nft;
                }
            }
        } catch (error) {
            console.error(`Error fetching NFT #${id}:`, error);
        }
        
        // Return cached version as fallback
        return cachedNFT || null;
    },
    
    // Get all NFTs (may require multiple API calls)
    getAllNFTs: async function() {
        // If we don't have any items yet, load fallback data
        if (this.items.length === 0) {
            await this.loadFallbackData();
        }
        
        if (!window.apiClient) {
            return this.items;
        }
        
        try {
            // Fetch all pages
            const allNFTs = [];
            let page = 1;
            let hasMore = true;
            
            while (hasMore) {
                const data = await apiClient.fetchNFTs(page, 50);
                if (data && data.nfts && data.nfts.length > 0) {
                    allNFTs.push(...data.nfts);
                    page++;
                    hasMore = page <= data.totalPages;
                } else {
                    hasMore = false;
                }
            }
            
            // Update items array if we got data
            if (allNFTs.length > 0) {
                this.items = allNFTs;
            }
            
            return this.items;
        } catch (error) {
            console.error('Error fetching all NFTs:', error);
            return this.items;
        }
    },
    
    // Get NFTs for pagination
    getNFTsPage: async function(page, perPage = 12) {
        // If we don't have any items yet, load fallback data
        if (this.items.length === 0) {
            await this.loadFallbackData();
        }
        
        // If API client is not available, use local data
        if (!window.apiClient) {
            const start = (page - 1) * perPage;
            const end = start + perPage;
            return this.items.slice(start, end);
        }
        
        try {
            const data = await apiClient.fetchNFTs(page, perPage);
            if (data && data.nfts) {
                // Update cache with these NFTs
                data.nfts.forEach(nft => {
                    const index = this.items.findIndex(item => item.id === nft.id);
                    if (index >= 0) {
                        this.items[index] = nft;
                    } else {
                        this.items.push(nft);
                    }
                });
                
                return data.nfts;
            }
        } catch (error) {
            console.error(`Error fetching NFTs page ${page}:`, error);
        }
        
        // Fallback to local data
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return this.items.slice(start, end);
    },
    
    // Claim NFT with contract address
    claimNFT: async function(id, contractAddress, claimedBy = 'Anonymous') {
        // If we don't have any items yet, load fallback data
        if (this.items.length === 0) {
            await this.loadFallbackData();
        }
        
        if (!window.apiClient) {
            // Fallback to local implementation
            const nft = this.items.find(item => item.id === id);
            if (nft && nft.status === 'unlocked') {
                nft.status = 'claimed';
                nft.contractAddress = contractAddress;
                nft.claimedBy = claimedBy;
                nft.claimedDate = new Date().toISOString();
                this.claimedCount++;
                
                // Trigger event for UI update
                document.dispatchEvent(new CustomEvent('nft-claimed', { 
                    detail: { id, contractAddress, claimedBy } 
                }));
                
                return true;
            }
            return false;
        }
        
        try {
            const result = await apiClient.claimNFT(id, contractAddress, claimedBy);
            if (result && result.success) {
                // Update local cache
                const nft = this.items.find(item => item.id === id);
                if (nft) {
                    nft.status = 'claimed';
                    nft.contractAddress = contractAddress;
                    nft.claimedBy = claimedBy;
                    nft.claimedDate = new Date().toISOString();
                }
                
                // Update claimed count
                this.claimedCount++;
                
                // Fetch updated stats
                this.fetchStats();
                
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error claiming NFT #${id}:`, error);
            return false;
        }
    },
    
    // Update NFT market data (price, volume, etc.)
    updateMarketData: async function(id, marketData) {
        // If we don't have any items yet, load fallback data
        if (this.items.length === 0) {
            await this.loadFallbackData();
        }
        
        const nft = this.items.find(item => item.id === id);
        if (nft) {
            nft.marketCap = marketData.marketCap || nft.marketCap;
            nft.volume24h = marketData.volume24h || nft.volume24h;
            nft.price = marketData.price || nft.price;
            nft.dataSource = marketData.source || nft.dataSource;
            
            // Trigger event for UI update
            document.dispatchEvent(new CustomEvent('nft-market-data-updated', { 
                detail: { 
                    id, 
                    marketCap: nft.marketCap,
                    volume24h: nft.volume24h,
                    price: nft.price,
                    dataSource: nft.dataSource
                } 
            }));
            
            return true;
        }
        return false;
    },
    
    // Fetch updated stats from API
    fetchStats: async function() {
        if (!window.apiClient) return;
        
        try {
            const stats = await apiClient.fetchStats();
            if (stats) {
                this.stats = stats;
                this.claimedCount = stats.claimed;
                this.totalNFTs = stats.total;
                
                // Update UI counters
                this.updateCounters();
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    },
    
    // Get remaining NFTs count
    getRemainingCount: function() {
        return this.totalNFTs - this.claimedCount;
    }
};

// Initialize NFT data
const galleryData = nftData.init();

// Export for use in other modules
window.galleryData = galleryData;
