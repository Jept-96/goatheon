/**
 * NFT Gallery UI
 * Handles UI interactions for the NFT gallery
 */

// Gallery UI controller
const galleryUI = {
    // UI state
    state: {
        currentPage: 1,
        itemsPerPage: 12,
        totalPages: Math.ceil(galleryData.totalNFTs / 12),
        isLoading: false,
        activeModal: null
    },
    
    // Initialize UI
    init: async function() {
        // Update counters
        this.updateCounters();
        
        // Render initial NFTs
        this.renderNFTs(1);
        
        // Set up event listeners
        this.setupEventListeners();
        
        return this;
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreNFTs();
            });
        }
        
        // Infinite scroll
        window.addEventListener('scroll', () => {
            this.handleInfiniteScroll();
        });
        
        // NFT item click
        document.addEventListener('click', (event) => {
            // Check if clicked element is an NFT item or its child
            const nftItem = event.target.closest('.nft-item');
            if (nftItem) {
                const id = parseInt(nftItem.dataset.id);
                
                // If claim button was clicked
                if (event.target.classList.contains('claim-button')) {
                    this.openNFTModal(id);
                } else if (!event.target.classList.contains('claimed-badge')) {
                    // If not clicking on the claimed badge, open modal
                    this.openNFTModal(id);
                }
            }
        });
        
        // Close modal
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('close-modal')) {
                console.log('Close modal button clicked');
                this.closeModal();
            }
            
            // Close modal when clicking outside the modal content
            if (event.target.classList.contains('modal')) {
                console.log('Modal background clicked');
                this.closeModal();
            }
        });
        
        // Add direct event listener to the close button
        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                console.log('Close button clicked directly');
                this.closeModal();
            });
        }
        
        // Submit contract address
        document.addEventListener('click', (event) => {
            if (event.target.id === 'submit-contract') {
                const input = document.getElementById('contract-address-input');
                if (input && this.state.activeModal) {
                    this.submitContractAddress(this.state.activeModal, input.value);
                }
            }
        });
        
        // Listen for NFT status updates
        document.addEventListener('nft-status-updated', (event) => {
            this.updateNFTItem(event.detail.id, event.detail.status);
            this.updateCounters();
        });
        
        // Listen for NFT unlocks
        document.addEventListener('nft-unlocked', (event) => {
            this.updateNFTItem(event.detail.id, 'unlocked');
            this.updateCounters();
            
            // Show notification
            this.showNotification(`NFT #${event.detail.id} has been unlocked! Be the first to claim it.`);
        });
        
        // Listen for NFT claims
        document.addEventListener('nft-claimed', (event) => {
            this.updateNFTItem(event.detail.id, 'claimed');
            this.updateCounters();
            
            // If modal is open for this NFT, update it
            if (this.state.activeModal === event.detail.id) {
                this.updateModalForClaimedNFT(event.detail.id);
            }
        });
        
        // Listen for market cap updates
        document.addEventListener('nft-marketcap-updated', (event) => {
            // If modal is open for this NFT, update market cap display
            if (this.state.activeModal === event.detail.id) {
                const mcapElement = document.getElementById('claimed-mcap');
                if (mcapElement) {
                    mcapElement.textContent = `$${event.detail.marketCap.toLocaleString()}`;
                }
            }
        });
        
        // Handle escape key for modal
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });
    },
    
    // Render NFTs for a specific page
    renderNFTs: async function(page) {
        const nftGrid = document.getElementById('nft-grid');
        if (!nftGrid) return;
        
        // If it's the first page, clear the grid
        if (page === 1) {
            nftGrid.innerHTML = '';
        }
        
        try {
            // Add a loading message to the grid if it's empty
            if (nftGrid.children.length === 0) {
                const loadingElement = document.createElement('div');
                loadingElement.className = 'loading-message';
                loadingElement.textContent = 'Loading NFTs...';
                loadingElement.style.textAlign = 'center';
                loadingElement.style.padding = '2rem';
                loadingElement.style.width = '100%';
                nftGrid.appendChild(loadingElement);
            }
            
            // Check if we have access to the galleryData object
            if (!window.galleryData || !window.galleryData.items) {
                console.log('Gallery data not available yet, waiting...');
                setTimeout(() => this.renderNFTs(page), 500);
                return;
            }
            
            // Force loading of fallback data if items array is empty
            if (window.galleryData.items.length === 0) {
                console.log('Items array is empty, loading fallback data...');
                await window.galleryData.loadFallbackData();
                
                // If still empty after loading fallback data, show error
                if (window.galleryData.items.length === 0) {
                    console.error('Failed to load NFT data');
                    const loadingMessage = nftGrid.querySelector('.loading-message');
                    if (loadingMessage) {
                        loadingMessage.textContent = 'Failed to load NFT data. Please refresh the page.';
                        loadingMessage.style.color = 'red';
                    }
                    return;
                }
            }
            
            console.log(`Rendering NFTs for page ${page}, items count: ${window.galleryData.items.length}`);
            
            // Calculate the slice of NFTs to display
            const start = (page - 1) * this.state.itemsPerPage;
            const end = start + this.state.itemsPerPage;
            const nfts = window.galleryData.items.slice(start, end);
            
            // Remove loading message if it exists
            const loadingMessage = nftGrid.querySelector('.loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }
            
            // Create HTML for each NFT
            if (Array.isArray(nfts) && nfts.length > 0) {
                nfts.forEach(nft => {
                    const nftElement = this.createNFTElement(nft);
                    nftGrid.appendChild(nftElement);
                });
                
                console.log(`Rendered ${nfts.length} NFTs for page ${page}`);
            } else {
                console.warn('No NFTs available for page', page);
            }
            
            // Update current page
            this.state.currentPage = page;
            
            // Hide load more button if all NFTs are loaded
            if (page >= this.state.totalPages) {
                const loadMoreBtn = document.getElementById('load-more-btn');
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error rendering NFTs:', error);
            
            // Add an error message to the grid
            if (nftGrid.children.length === 0) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = 'Error loading NFTs. Please try again later.';
                errorElement.style.textAlign = 'center';
                errorElement.style.padding = '2rem';
                errorElement.style.color = 'red';
                errorElement.style.width = '100%';
                nftGrid.appendChild(errorElement);
            }
        }
    },
    
    // Create HTML element for an NFT
    createNFTElement: function(nft) {
        const nftItem = document.createElement('div');
        nftItem.className = `nft-item ${nft.status}`;
        nftItem.dataset.id = nft.id;
        
        let overlayHTML = '';
        
        // Different overlay based on status
        if (nft.status === 'locked') {
            overlayHTML = `
                <div class="lock-overlay">
                    <span class="lock-icon" style="font-size: 50px;">🔒</span>
                </div>
            `;
        } else if (nft.status === 'unlocked') {
            overlayHTML = `
                <div class="unlock-overlay">
                    <button class="claim-button">CLAIM</button>
                </div>
            `;
        } else if (nft.status === 'claimed') {
            overlayHTML = `
                <div class="claimed-overlay">
                    <span class="claimed-badge">CLAIMED</span>
                </div>
            `;
        }
        
        // Mask the title for locked NFTs
        const displayTitle = nft.status === 'locked' ? `GOAT #${nft.id}` : nft.title;
        
        nftItem.innerHTML = `
            <div class="nft-image-container">
                <img src="${nft.image}" alt="${displayTitle}" class="nft-image">
                ${overlayHTML}
            </div>
            <div class="nft-info">
                <h3 class="nft-title">${displayTitle}</h3>
                <div class="nft-status">${nft.status}</div>
            </div>
        `;
        
        return nftItem;
    },
    
    // Update an existing NFT item in the grid
    updateNFTItem: function(id, status) {
        const nftItem = document.querySelector(`.nft-item[data-id="${id}"]`);
        if (!nftItem) return;
        
        // Update class
        nftItem.className = `nft-item ${status}`;
        
        // Update status text
        const statusElement = nftItem.querySelector('.nft-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
        
        // Update overlay
        const imageContainer = nftItem.querySelector('.nft-image-container');
        if (imageContainer) {
            // Remove existing overlay
            const existingOverlay = imageContainer.querySelector('.lock-overlay, .unlock-overlay, .claimed-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // Add new overlay based on status
            let overlayHTML = '';
            
            if (status === 'locked') {
                overlayHTML = `
                    <div class="lock-overlay">
                        <span class="lock-icon" style="font-size: 50px;">🔒</span>
                    </div>
                `;
            } else if (status === 'unlocked') {
                overlayHTML = `
                    <div class="unlock-overlay">
                        <button class="claim-button">CLAIM</button>
                    </div>
                `;
            } else if (status === 'claimed') {
                overlayHTML = `
                    <div class="claimed-overlay">
                        <span class="claimed-badge">CLAIMED</span>
                    </div>
                `;
            }
            
            // Insert new overlay
            imageContainer.insertAdjacentHTML('beforeend', overlayHTML);
        }
    },
    
    // Load more NFTs (next page)
    loadMoreNFTs: function() {
        if (this.state.isLoading || this.state.currentPage >= this.state.totalPages) return;
        
        this.state.isLoading = true;
        
        // Render next page
        this.renderNFTs(this.state.currentPage + 1);
        
        this.state.isLoading = false;
    },
    
    // Handle infinite scroll
    handleInfiniteScroll: function() {
        if (this.state.isLoading || this.state.currentPage >= this.state.totalPages) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Load more when scrolled to bottom (with threshold)
        if (scrollY + windowHeight >= documentHeight - 200) {
            this.loadMoreNFTs();
        }
    },
    
    // Update counters
    updateCounters: function() {
        // Update total count
        const totalElement = document.getElementById('total-count');
        if (totalElement) {
            totalElement.textContent = galleryData.totalNFTs;
        }
        
        // Update claimed count
        const claimedElement = document.getElementById('claimed-count');
        if (claimedElement) {
            claimedElement.textContent = galleryData.claimedCount;
        }
        
        // Update remaining count
        const remainingElement = document.getElementById('remaining-count');
        if (remainingElement) {
            // Calculate remaining count (handle case where stats is not yet initialized)
            const remaining = galleryData.stats && galleryData.stats.remaining !== undefined 
                ? galleryData.stats.remaining 
                : galleryData.totalNFTs - galleryData.claimedCount;
            
            remainingElement.textContent = remaining;
        }
    },
    
    // Open NFT detail modal
    openNFTModal: async function(id) {
        const modal = document.getElementById('nft-detail-modal');
        if (!modal) return;
        
        // Set active modal
        this.state.activeModal = id;
        
        // Show modal with loading state
        modal.classList.add('show');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Add direct event listener to the close button
        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn) {
            // Remove any existing event listeners
            closeModalBtn.replaceWith(closeModalBtn.cloneNode(true));
            
            // Add new event listener
            document.getElementById('close-modal-btn').addEventListener('click', () => {
                console.log('Close button clicked from modal open');
                this.closeModal();
            });
        }
        
        try {
            // Check if getNFT is available
            if (typeof galleryData.getNFT !== 'function') {
                console.warn('getNFT not available yet, showing loading state');
                
                // Show loading state in modal
                const modalTitle = document.getElementById('modal-title');
                const modalDescription = document.getElementById('modal-description');
                const modalImage = document.getElementById('modal-image');
                
                if (modalTitle) modalTitle.textContent = 'Loading...';
                if (modalDescription) modalDescription.textContent = 'Loading NFT data...';
                if (modalImage) modalImage.src = 'assets/images/nft-placeholder.gif';
                
                // Try again in a moment
                setTimeout(() => this.openNFTModal(id), 500);
                return;
            }
            
            // Get NFT data
            const nft = await galleryData.getNFT(id);
            if (!nft) {
                console.error('NFT not found:', id);
                this.closeModal();
                this.showNotification('NFT not found', 'error');
                return;
            }
            
            // Update modal content
            this.updateModalContent(nft);
        } catch (error) {
            console.error('Error opening NFT modal:', error);
            this.closeModal();
            this.showNotification('Error loading NFT data', 'error');
        }
    },
    
    // Close modal
    closeModal: function() {
        const modal = document.getElementById('nft-detail-modal');
        if (!modal) return;
        
        console.log('Closing modal');
        
        // Force hide modal with multiple approaches
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('style', 'display: none !important');
        
        // Reset active modal
        this.state.activeModal = null;
        
        // Allow body scrolling
        document.body.style.overflow = '';
        
        // Clear any pending timeouts
        if (this._modalTimeout) {
            clearTimeout(this._modalTimeout);
            this._modalTimeout = null;
        }
        
        // Add a click handler to the document to close the modal if it's still visible
        setTimeout(() => {
            if (modal.offsetParent !== null) {
                console.log('Modal still visible, forcing close');
                modal.style.display = 'none';
                modal.setAttribute('style', 'display: none !important');
                document.body.style.overflow = '';
            }
        }, 100);
    },
    
    // Update modal content
    updateModalContent: function(nft) {
        // Update image
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            modalImage.src = nft.image;
            modalImage.alt = nft.status === 'locked' ? `GOAT #${nft.id}` : nft.title;
            
            // Apply blur if locked
            if (nft.status === 'locked') {
                modalImage.style.filter = 'blur(10px)';
            } else {
                modalImage.style.filter = '';
            }
        }
        
        // Update title - mask for locked NFTs
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            modalTitle.textContent = nft.status === 'locked' ? `GOAT #${nft.id}` : nft.title;
        }
        
        // Update description - hide for locked NFTs
        const modalDescription = document.getElementById('modal-description');
        if (modalDescription) {
            if (nft.status === 'locked') {
                modalDescription.textContent = "This GOAT's identity and story will be revealed when it unlocks!";
            } else {
                modalDescription.textContent = nft.description;
            }
        }
        
        // Update status overlay
        const statusOverlay = document.getElementById('modal-status-overlay');
        if (statusOverlay) {
            statusOverlay.className = 'modal-status-overlay';
            statusOverlay.innerHTML = '';
            
            if (nft.status === 'locked') {
                statusOverlay.innerHTML = `
                    <span class="lock-icon" style="font-size: 80px;">🔒</span>
                `;
                statusOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            } else if (nft.status === 'claimed') {
                statusOverlay.innerHTML = `
                    <span class="claimed-badge" style="transform: rotate(-45deg); padding: 1rem 2rem; font-size: 1.5rem;">CLAIMED</span>
                `;
                statusOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            } else {
                statusOverlay.style.backgroundColor = 'transparent';
            }
        }
        
        // Show/hide claim section based on status
        const claimSection = document.getElementById('claim-section');
        const claimedSection = document.getElementById('claimed-section');
        
        if (claimSection && claimedSection) {
            if (nft.status === 'unlocked') {
                claimSection.classList.remove('hidden');
                claimedSection.classList.add('hidden');
            } else if (nft.status === 'claimed') {
                claimSection.classList.add('hidden');
                claimedSection.classList.remove('hidden');
                
                // Update claimed info
                this.updateClaimedInfo(nft);
            } else {
                // Locked status
                claimSection.classList.add('hidden');
                claimedSection.classList.add('hidden');
            }
        }
    },
    
    // Update claimed info in modal
    updateClaimedInfo: function(nft) {
        // Contract address
        const claimedContract = document.getElementById('claimed-contract');
        if (claimedContract && nft.contractAddress) {
            claimedContract.textContent = nft.contractAddress;
        }
        
        // If we have market data API, use it to get real-time data
        if (window.marketData && nft.contractAddress) {
            // Show loading state
            const priceElement = document.getElementById('claimed-price');
            const mcapElement = document.getElementById('claimed-mcap');
            const volumeElement = document.getElementById('claimed-volume');
            const sourceElement = document.getElementById('data-source');
            
            if (priceElement) priceElement.textContent = 'Loading...';
            if (mcapElement) mcapElement.textContent = 'Loading...';
            if (volumeElement) volumeElement.textContent = 'Loading...';
            
            // Fetch market data
            const tokenData = marketData.getTokenData(nft.contractAddress);
            
            // Update UI with market data
            if (priceElement) {
                priceElement.textContent = marketData.formatPrice(tokenData.price);
            }
            
            if (mcapElement) {
                mcapElement.textContent = marketData.formatCurrency(tokenData.marketCap);
            }
            
            if (volumeElement) {
                volumeElement.textContent = marketData.formatCurrency(tokenData.volume24h);
            }
            
            if (sourceElement) {
                sourceElement.textContent = tokenData.source || 'Birdeye';
            }
            
            // Update NFT data
            nft.marketCap = tokenData.marketCap;
            nft.volume24h = tokenData.volume24h;
            nft.price = tokenData.price;
            nft.dataSource = tokenData.source;
            
            // No need to save to localStorage anymore as we're using the API
        } else {
            // Fallback to existing market cap data or simulate it
            const mcapElement = document.getElementById('claimed-mcap');
            if (mcapElement) {
                if (nft.marketCap) {
                    mcapElement.textContent = `$${nft.marketCap.toLocaleString()}`;
                } else {
                    mcapElement.textContent = 'Loading...';
                    
                    // Simulate market cap fetch
                    setTimeout(() => {
                        const randomMcap = Math.floor(Math.random() * 100000) + 5000;
                        galleryData.updateMarketCap(nft.id, randomMcap);
                    }, 1500);
                }
            }
        }
        
        // Claimed by
        const claimedBy = document.getElementById('claimed-by');
        if (claimedBy) {
            claimedBy.textContent = nft.claimedBy || 'Anonymous';
        }
        
        // Claimed date
        const claimedDate = document.getElementById('claimed-date');
        if (claimedDate && nft.claimedDate) {
            const date = new Date(nft.claimedDate);
            claimedDate.textContent = date.toLocaleDateString();
        }
    },
    
    // Update modal for claimed NFT
    updateModalForClaimedNFT: async function(id) {
        try {
            // Check if getNFT is available
            if (typeof galleryData.getNFT !== 'function') {
                console.warn('getNFT not available yet, showing loading state');
                
                // Show loading state in modal
                const modalTitle = document.getElementById('modal-title');
                const modalDescription = document.getElementById('modal-description');
                
                if (modalTitle) modalTitle.textContent = 'Updating...';
                if (modalDescription) modalDescription.textContent = 'Updating NFT data...';
                
                // Try again in a moment
                setTimeout(() => this.updateModalForClaimedNFT(id), 500);
                return;
            }
            
            // Get NFT data
            const nft = await galleryData.getNFT(id);
            if (!nft) {
                console.error('NFT not found:', id);
                return;
            }
            
            // Update modal content
            this.updateModalContent(nft);
        } catch (error) {
            console.error('Error updating claimed NFT modal:', error);
        }
    },
    
    // Submit contract address
    submitContractAddress: async function(id, contractAddress) {
        if (!contractAddress.trim()) {
            this.showNotification('Please enter a valid contract address', 'error');
            return;
        }
        
        try {
            // Check if claimNFT is available
            if (typeof galleryData.claimNFT !== 'function') {
                console.warn('claimNFT not available yet, showing loading state');
                
                // Show loading state
                const submitButton = document.getElementById('submit-contract');
                if (submitButton) {
                    submitButton.textContent = 'WAITING...';
                    submitButton.disabled = true;
                }
                
                // Try again in a moment
                setTimeout(() => this.submitContractAddress(id, contractAddress), 500);
                return;
            }
            
            // Show loading state
            const submitButton = document.getElementById('submit-contract');
            if (submitButton) {
                submitButton.textContent = 'SUBMITTING...';
                submitButton.disabled = true;
            }
            
            // Claim the NFT
            const success = await galleryData.claimNFT(id, contractAddress);
            
            // Reset button state
            if (submitButton) {
                submitButton.textContent = 'SUBMIT';
                submitButton.disabled = false;
            }
            
            if (success) {
                // Show success notification
                this.showNotification('NFT claimed successfully!', 'success');
                
                // Update modal
                this.updateModalForClaimedNFT(id);
            } else {
                // Show error notification
                this.showNotification('Failed to claim NFT. It may already be claimed.', 'error');
            }
        } catch (error) {
            console.error('Error claiming NFT:', error);
            
            // Reset button state
            const submitButton = document.getElementById('submit-contract');
            if (submitButton) {
                submitButton.textContent = 'SUBMIT';
                submitButton.disabled = false;
            }
            
            // Show error notification
            this.showNotification('Error claiming NFT: ' + error.message, 'error');
        }
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add styles if not already in CSS
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 9999;
                    }
                    .notification {
                        background-color: var(--color-card-bg);
                        color: var(--color-text);
                        border-radius: var(--border-radius-md);
                        padding: 15px 20px;
                        margin-bottom: 10px;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        min-width: 300px;
                        max-width: 400px;
                        animation: slideIn 0.3s ease, fadeOut 0.5s ease 4.5s forwards;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .notification.success {
                        border-left: 4px solid #4CAF50;
                    }
                    .notification.error {
                        border-left: 4px solid #F44336;
                    }
                    .notification.info {
                        border-left: 4px solid #2196F3;
                    }
                    .notification-close {
                        background: none;
                        border: none;
                        color: var(--color-text);
                        cursor: pointer;
                        font-size: 1.2rem;
                        opacity: 0.7;
                        transition: opacity 0.3s;
                    }
                    .notification-close:hover {
                        opacity: 1;
                    }
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes fadeOut {
                        from {
                            opacity: 1;
                        }
                        to {
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
};

// Initialize gallery UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery UI
    const ui = galleryUI.init();
    
    // Export for use in other modules
    window.galleryUI = ui;
});
