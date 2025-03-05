/**
 * NFT Gallery Timer System
 * Handles the timed unlock mechanism for NFTs
 */

console.log('Gallery Timer Loaded:', window.launchConfig);

// Timer system
const galleryTimer = {
    // Timer intervals in milliseconds
    intervals: {
        batch1: 15 * 60 * 1000, // 1-10: 15 minutes
        batch2: 30 * 60 * 1000, // 11-20: 30 minutes
        batch3: 45 * 60 * 1000, // 21-30: 45 minutes
        batch4: 60 * 60 * 1000, // 31-40: 1 hour
        batch5: 75 * 60 * 1000, // 41-50: 1 hour 15 minutes
        batch6: 90 * 60 * 1000, // 51-60: 1 hour 30 minutes
        batch7: 105 * 60 * 1000, // 61-70: 1 hour 45 minutes
        batch8: 120 * 60 * 1000, // 71-80: 2 hours
        batch9: 135 * 60 * 1000, // 81-90: 2 hours 15 minutes
        batch10: 150 * 60 * 1000, // 91-100: 2 hours 30 minutes
        batch11: 165 * 60 * 1000  // 101-102: 2 hours 45 minutes
    },
    
// Timer state
state: {
    isRunning: false,
    startTime: null,
    nextUnlockTime: null,
    nextUnlockId: 1,
    timers: []
},

// Initialize timer system
init: function() {
    // Try to load timer state from localStorage
    this.loadTimerState();
    
    // If timer is not running or no state was loaded, set up initial state
    if (!this.state.isRunning) {
        this.resetTimerState();
    }
    
    // Set up timer display update
    this.setupTimerDisplay();
    
    // Add launch state listener
    document.addEventListener('launchStateChanged', (e) => {
        console.log('Launch state changed:', e.detail);  // Debug message
        if (e.detail.isLaunched || e.detail.previewMode) {
            this.start();
        } else {
            this.stop();
        }
    });
    
    // Check if already launched
    if (window.launchConfig && launchConfig.canUnlock()) {
        console.log('Initial launch check: canUnlock = true');  // Debug message
        this.start();
    } else {
        console.log('Initial launch check: canUnlock = false');  // Debug message
    }
    
    return this;
},

// Reset timer state
resetTimerState: function() {
    const now = new Date().getTime();
    
    this.state = {
        isRunning: false,
        startTime: now,
        nextUnlockTime: now + this.getIntervalForNFT(1),
        nextUnlockId: 1,
        timers: []
    };
    
    // Save the state
    this.saveTimerState();
    localStorage.removeItem('nftTimerState'); // Add this line
},

// Start the timer system
start: function() {
    console.log('Start function called');  // Debug message

    // Reset timer state when starting fresh
    this.resetTimerState();  // Add this line here
    
    // Don't start if not launched and not in preview mode
    if (window.launchConfig && !launchConfig.canUnlock()) {
        console.log('Timer not started: Launch not active');
        return;
    }
    console.log('Starting timer...');  // Debug message

    if (this.state.isRunning) {
        console.log('Timer already running');  // Debug message
        return;
    }
    
    const now = new Date().getTime();
    
    // If launch date is set and it's in the future, don't start yet
    if (window.launchConfig && launchConfig.launchDate) {
        const launchTime = new Date(launchConfig.launchDate).getTime();
        if (launchTime > now) {
            console.log('Launch scheduled for:', new Date(launchTime));
            setTimeout(() => this.start(), launchTime - now);
            return;
        }
    }
    
    // Set start time if not set
    if (!this.state.startTime) {
        this.state.startTime = now;
    }
    
    // Set next unlock time if not set
    if (!this.state.nextUnlockTime) {
        this.state.nextUnlockTime = now + this.getIntervalForNFT(this.state.nextUnlockId);
    }
    
    // Set running state
    this.state.isRunning = true;
    
    // Schedule the first unlock
    this.scheduleNextUnlock();
    
    // Save the state
    this.saveTimerState();
    
    console.log('Timer system started');
},

// Stop the timer system
stop: function() {
    console.log('Stopping timer system');  // Debug message
    
    // Clear all timers
    this.state.timers.forEach(timer => clearTimeout(timer));
    this.state.timers = [];

    // Reset timer state
    this.resetTimerState();  // Add this line here
    
    // Set running state
    this.state.isRunning = false;
    
    // Save the state
    this.saveTimerState();
    
    console.log('Timer system stopped');
},

// Resume timers after page reload
resumeTimers: function() {
    // Don't resume if not launched and not in preview mode
    if (window.launchConfig && !launchConfig.canUnlock()) {
        console.log('Timer not resumed: Launch not active');
        return;
    }

    const now = new Date().getTime();
    
    // Check if any NFTs should have been unlocked while the page was closed
    if (this.state.nextUnlockTime <= now) {
        // Process all NFTs that should have been unlocked
        while (this.state.nextUnlockTime <= now && this.state.nextUnlockId <= galleryData.totalNFTs) {
            // Unlock the NFT
            this.unlockNFT(this.state.nextUnlockId);
            
            // Move to the next NFT
            this.state.nextUnlockId++;
            
            // If all NFTs are unlocked, stop the timer
            if (this.state.nextUnlockId > galleryData.totalNFTs) {
                this.stop();
                break;
            }
            
            // Calculate next unlock time
            this.state.nextUnlockTime = this.state.startTime + this.calculateUnlockTime(this.state.nextUnlockId);
        }
    }
    
    // Schedule the next unlock if there are still NFTs to unlock
    if (this.state.nextUnlockId <= galleryData.totalNFTs) {
        this.scheduleNextUnlock();
    }
    
    // Save the state
    this.saveTimerState();
},

// Schedule the next NFT unlock
scheduleNextUnlock: function() {
    const now = new Date().getTime();
    const timeUntilNextUnlock = Math.max(0, this.state.nextUnlockTime - now);
    
    // Clear any existing timers
    this.state.timers.forEach(timer => clearTimeout(timer));
    this.state.timers = [];
    
    // Schedule the next unlock
    const timerId = setTimeout(() => {
        // Don't unlock if launch was stopped
        if (window.launchConfig && !launchConfig.canUnlock()) {
            console.log('Unlock skipped: Launch not active');
            return;
        }

        // Unlock the NFT
        this.unlockNFT(this.state.nextUnlockId);
        
        // Move to the next NFT
        this.state.nextUnlockId++;
        
        // If all NFTs are unlocked, stop the timer
        if (this.state.nextUnlockId > galleryData.totalNFTs) {
            this.stop();
            return;
        }
        
        // Calculate next unlock time
        this.state.nextUnlockTime = this.state.startTime + this.calculateUnlockTime(this.state.nextUnlockId);
        
        // Save the state
        this.saveTimerState();
        
        // Schedule the next unlock
        this.scheduleNextUnlock();
    }, timeUntilNextUnlock);
    
    // Store the timer ID
    this.state.timers.push(timerId);
    
    // Update the timer display
    this.updateTimerDisplay();
    
    console.log(`Next unlock (NFT #${this.state.nextUnlockId}) scheduled in ${this.formatTime(timeUntilNextUnlock)}`);
},

// Unlock an NFT
unlockNFT: function(id) {
    // Update NFT status in the data
    galleryData.updateNFTStatus(id, 'unlocked');
    
    // Set unlock time
    galleryData.setNFTUnlockTime(id, new Date().toISOString());
    
    // Save gallery data
    galleryData.saveToLocalStorage();
    
    // Trigger event for UI update
    document.dispatchEvent(new CustomEvent('nft-unlocked', { 
        detail: { id } 
    }));
    
    console.log(`NFT #${id} unlocked`);
},

// Get interval for NFT based on its ID
getIntervalForNFT: function(id) {
    if (id <= 10) return this.intervals.batch1;
    if (id <= 20) return this.intervals.batch2;
    if (id <= 30) return this.intervals.batch3;
    if (id <= 40) return this.intervals.batch4;
    if (id <= 50) return this.intervals.batch5;
    if (id <= 60) return this.intervals.batch6;
    if (id <= 70) return this.intervals.batch7;
    if (id <= 80) return this.intervals.batch8;
    if (id <= 90) return this.intervals.batch9;
    if (id <= 100) return this.intervals.batch10;
    return this.intervals.batch11;
},

// Calculate total time until NFT unlock
calculateUnlockTime: function(id) {
    let totalTime = 0;
    
    // For the first NFT
    if (id === 1) {
        return this.getIntervalForNFT(1);
    }
    
    // For subsequent NFTs, add up all previous intervals
    for (let i = 1; i < id; i++) {
        totalTime += this.getIntervalForNFT(i);
    }
    
    return totalTime;
},

// Set up timer display update
setupTimerDisplay: function() {
    // Update timer display every second
    setInterval(() => {
        this.updateTimerDisplay();
    }, 1000);
    
    // Initial update
    this.updateTimerDisplay();
},

// Update timer display
updateTimerDisplay: function() {
    const timerElement = document.getElementById('next-unlock');
    if (!timerElement) return;
    
    // Don't show timer if not launched and not in preview mode
    if (window.launchConfig && !launchConfig.canUnlock()) {
        console.log('Timer display: Launch not active');  // Debug message
        timerElement.textContent = 'Launch Pending';
        return;
    }
    
    if (!this.state.isRunning || this.state.nextUnlockId > galleryData.totalNFTs) {
        timerElement.textContent = '--:--:--';
        return;
    }
    
    const now = new Date().getTime();
    const timeUntilNextUnlock = Math.max(0, this.state.nextUnlockTime - now);
    
    timerElement.textContent = this.formatTime(timeUntilNextUnlock);
},

// Format time in HH:MM:SS
formatTime: function(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
},

// Save timer state to localStorage
saveTimerState: function() {
    try {
        localStorage.setItem('nftTimerState', JSON.stringify(this.state));
        return true;
    } catch (error) {
        console.error('Error saving timer state to localStorage:', error);
        return false;
    }
},

// Load timer state from localStorage
loadTimerState: function() {
    try {
        const savedState = localStorage.getItem('nftTimerState');
        if (savedState) {
            this.state = JSON.parse(savedState);
            
            // Convert timers array to empty array since timers don't persist
            this.state.timers = [];
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error loading timer state from localStorage:', error);
        return false;
    }
}};

// Initialize timer system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize timer system
    const timer = galleryTimer.init();
    
    // Export for use in other modules
    window.galleryTimer = timer;
});

