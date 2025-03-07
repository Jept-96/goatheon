const launchConfig = {
    // Launch state
    isLaunched: false,
    launchDate: null,
    previewMode: false,
    
    // Admin credentials - Change this password!
    adminHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // Default: "password"
    
    // Session settings
    sessionTimeout: 3600000, // 1 hour in milliseconds
    maxLoginAttempts: 3,
    
    // Rate limiting
    rateLimitWindow: 900000, // 15 minutes in milliseconds
    maxAttempts: 5,
    
    // Save launch state
    save() {
        const saveData = {
            isLaunched: this.isLaunched,
            launchDate: this.launchDate,
            previewMode: this.previewMode
        };
        
        // Emit to server instead of saving to localStorage
        if (socket) {
            if (this.previewMode !== undefined) {
                socket.emit('togglePreview', this.previewMode);
            }
            socket.emit('setLaunchState', {
                isLaunched: this.isLaunched,
                launchDate: this.launchDate
            });
        }
        
        document.dispatchEvent(new CustomEvent('launchStateChanged', { 
            detail: saveData 
        }));
    },
    
    // Set launch state
    setLaunchState(isLaunched, launchDate = null) {
        this.isLaunched = isLaunched;
        this.launchDate = launchDate || (isLaunched ? new Date().toISOString() : null);
        this.save();
    },
    
    // Toggle preview mode
    togglePreview(enabled) {
        this.previewMode = enabled;
        this.save();
    },
    
    // Reset all settings
    reset() {
        this.isLaunched = false;
        this.launchDate = null;
        this.previewMode = false;
        this.save();
    },
    
    // Check if NFTs should be unlockable
    canUnlock() {
        return this.isLaunched || this.previewMode;
    },
    
    // Get time elapsed since launch
    getElapsedTime() {
        if (!this.launchDate) return 0;
        const launch = new Date(this.launchDate).getTime();
        return Date.now() - launch;
    }
    };
    
    // Initialize and sync with server state
    document.addEventListener('DOMContentLoaded', () => {
    if (socket) {
    socket.emit('requestState');
    socket.on('timerState', (state) => {
    launchConfig.isLaunched = state.isLaunched;
    launchConfig.launchDate = state.launchDate;
    launchConfig.previewMode = state.previewMode;
    });
    }
    });
    
    // Export for use in other modules
    if (typeof module !== 'undefined' && module.exports) {
    module.exports = launchConfig;
    } else {
    window.launchConfig = launchConfig;
    }
    
    console.log('Launch Config Initialized:', launchConfig);
