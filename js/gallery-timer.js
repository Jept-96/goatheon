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

init: function() {
    // Set up timer display update
    this.setupTimerDisplay();
    
    // Handle server timer state
    socket.on('timerState', (state) => {
        console.log('Received server state:', state);
        this.updateStateFromServer(state);
    });

    socket.on('timerStateChanged', (state) => {
        console.log('Server state changed:', state);
        this.updateStateFromServer(state);
    });

    // Add launch state listener
    document.addEventListener('launchStateChanged', (e) => {
        if (e.detail.isLaunched || e.detail.previewMode) {
            this.start();
        } else {
            this.stop();
        }
    });

    return this;
},

// Update local state from server
updateStateFromServer: function(serverState) {
    this.state.isRunning = serverState.isRunning;
    this.state.startTime = serverState.startTime;
    this.state.nextUnlockTime = serverState.nextUnlockTime;
    this.state.nextUnlockId = serverState.nextUnlockId;

    if (this.state.isRunning) {
        this.scheduleNextUnlock();
    } else {
        // Clear any existing timers
        this.state.timers.forEach(timer => clearTimeout(timer));
        this.state.timers = [];
    }

    this.updateTimerDisplay();
},

// Start the timer system
start: function() {
    if (this.state.isRunning) return;
    
    socket.emit('setLaunchState', {
        isLaunched: true,
        launchDate: new Date().toISOString()
    });
},

// Stop the timer system
stop: function() {
    socket.emit('setLaunchState', {
        isLaunched: false,
        launchDate: null
    });
},

// Schedule the next NFT unlock
scheduleNextUnlock: function() {
    const now = new Date().getTime();
    const timeUntilNextUnlock = Math.max(0, this.state.nextUnlockTime - now);
    
    // Clear any existing timers
    this.state.timers.forEach(timer => clearTimeout(timer));
    this.state.timers = [];
    
    if (timeUntilNextUnlock <= 0) {
        // Request current state if timer is past due
        socket.emit('requestState');
        return;
    }
    
    // Schedule the next unlock
    const timerId = setTimeout(() => {
        this.unlockNFT(this.state.nextUnlockId);
        
        socket.emit('nftUnlocked', {
            nextId: this.state.nextUnlockId + 1,
            nextUnlockTime: Date.now() + this.getIntervalForNFT(this.state.nextUnlockId + 1)
        });
    }, timeUntilNextUnlock);
    
    this.state.timers.push(timerId);
},

// Unlock an NFT
unlockNFT: function(id) {
    // Update NFT status in the data
    galleryData.updateNFTStatus(id, 'unlocked');
    galleryData.setNFTUnlockTime(id, new Date().toISOString());
    
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

// Update timer display
updateTimerDisplay: function() {
    const timerElement = document.getElementById('next-unlock');
    if (!timerElement) return;
    
    if (!this.state.isRunning || this.state.nextUnlockId > 102) {
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

// Set up timer display update
setupTimerDisplay: function() {
    setInterval(() => {
        this.updateTimerDisplay();
    }, 1000);
}
};

// Initialize timer system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
const timer = galleryTimer.init();
window.galleryTimer = timer;
});

