/**
 * Background Audio Manager
 * Handles autoplay and scroll-based audio playback
 */

class BackgroundAudioManager {
    constructor() {
        this.audioElement = document.getElementById('background-audio');
        this.initialized = false;
        this.hasScrolled = false;
        // Default to enabled unless explicitly disabled
        this.wasEnabled = localStorage.getItem('bgAudioEnabled') !== 'false';

        // Create audio control button
        this.createAudioControl();
        
        // Bind methods
        this.handleScroll = this.handleScroll.bind(this);
        this.initAudio = this.initAudio.bind(this);
        this.updateAudioControl = this.updateAudioControl.bind(this);

        // Add click event listener to document
        document.addEventListener('click', () => {
            if (!this.initialized) {
                this.initAudio();
            }
        }, { once: true });
    }

    createAudioControl() {
        // Create audio control button
        const audioControl = document.createElement('div');
        audioControl.id = 'audio-control';
        audioControl.className = 'audio-control';
        audioControl.innerHTML = `
            <button class="audio-toggle">
                <span class="audio-on">🔊</span>
                <span class="audio-off">🔈</span>
            </button>
        `;
        document.body.appendChild(audioControl);

        // Style the control
        const style = document.createElement('style');
        style.textContent = `
            .audio-control {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            .audio-toggle {
                background: rgba(0, 0, 0, 0.5);
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                transition: all 0.3s ease;
            }
            .audio-toggle:hover {
                background: rgba(0, 0, 0, 0.7);
                transform: scale(1.1);
            }
            .audio-on, .audio-off {
                position: absolute;
            }
            .audio-control[data-muted="true"] .audio-on {
                display: none;
            }
            .audio-control[data-muted="false"] .audio-off {
                display: none;
            }
        `;
        document.head.appendChild(style);

        // Add click handler
        const toggleBtn = audioControl.querySelector('.audio-toggle');
        toggleBtn.addEventListener('click', () => this.toggleAudio());

        this.audioControl = audioControl;
        this.updateAudioControl();
    }

    updateAudioControl() {
        if (this.audioControl) {
            this.audioControl.setAttribute('data-muted', 
                !this.initialized || this.audioElement.muted ? 'true' : 'false');
        }
    }

    init() {
        if (!this.audioElement) {
            console.error('Audio element not found');
            return;
        }

        // Try to initialize audio immediately
        this.initAudio();

        // Add scroll listener for fallback
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        // Add visibility change listener
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.audioElement.pause();
            } else if (this.wasEnabled && !this.audioElement.muted) {
                this.audioElement.play().catch(() => {});
            }
        });
    }

    initAudio() {
        if (this.initialized || !this.audioElement) return;

        // Set initial volume
        this.audioElement.volume = 0.5;
        this.audioElement.muted = false;

        // Try to play audio unmuted
        this.audioElement.play().then(() => {
            console.log('Autoplay successful');
            this.initialized = true;
            this.updateAudioControl();
        }).catch(error => {
            console.log('Autoplay failed, waiting for user interaction:', error);
            
            // Add one-time click handler to start audio
            const startAudio = () => {
                this.audioElement.play()
                    .then(() => {
                        this.initialized = true;
                        this.updateAudioControl();
                    })
                    .catch(console.error);
                document.removeEventListener('click', startAudio);
            };
            document.addEventListener('click', startAudio);
        });
    }

    handleScroll() {
        if (this.hasScrolled || !this.audioElement) return;
        this.hasScrolled = true;

        // Try to play and unmute the audio
        this.audioElement.play().then(() => {
            if (this.wasEnabled) {
                this.audioElement.muted = false;
            }
            this.initialized = true;
            this.updateAudioControl();
            
            // Remove scroll listener since we don't need it anymore
            window.removeEventListener('scroll', this.handleScroll);
        }).catch(error => {
            console.log('Failed to play audio after scroll:', error);
        });
    }

    toggleAudio() {
        if (!this.initialized) {
            this.initAudio();
        }

        if (!this.audioElement) return;

        this.audioElement.muted = !this.audioElement.muted;
        this.wasEnabled = !this.audioElement.muted;
        localStorage.setItem('bgAudioEnabled', this.wasEnabled);
        this.updateAudioControl();

        if (!this.audioElement.muted && this.audioElement.paused) {
            this.audioElement.play().catch(() => {});
        }

        console.log('Audio state:', {
            muted: this.audioElement.muted,
            paused: this.audioElement.paused,
            volume: this.audioElement.volume,
            currentTime: this.audioElement.currentTime
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Background Audio Manager');
    const audioManager = new BackgroundAudioManager();
    audioManager.init();
});
