/**
 * Launch Configuration
 * Controls the NFT gallery launch state and timing
 */

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
        localStorage.setItem('launchConfig', JSON.stringify(saveData));
        
        // Trigger event for any listeners
        document.dispatchEvent(new CustomEvent('launchStateChanged', { 
            detail: saveData 
        }));
    },

    // Load launch state
    load() {
        try {
            const saved = localStorage.getItem('launchConfig');
            if (saved) {
                const data = JSON.parse(saved);
                this.isLaunched = data.isLaunched;
                this.launchDate = data.launchDate;
                this.previewMode = data.previewMode;
                return true;
            }
        } catch (error) {
            console.error('Error loading launch config:', error);
        }
        return false;
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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    launchConfig.load();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = launchConfig;
} else {
    window.launchConfig = launchConfig;
}

console.log('Launch Config Initialized:', launchConfig);