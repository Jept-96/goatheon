/**
 * Admin Authentication System
 * Handles admin login and session management
 */

class AdminAuth {
    constructor() {
        this.attempts = 0;
        this.lastAttemptTime = 0;
        this.isLoggedIn = false;
        this.sessionStartTime = null;
    }

    // Hash password using SHA-256
    async hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Login attempt
    async login(password) {
        // Check rate limiting
        const now = Date.now();
        if (now - this.lastAttemptTime < launchConfig.rateLimitWindow) {
            if (this.attempts >= launchConfig.maxAttempts) {
                throw new Error('Too many login attempts. Please try again later.');
            }
        } else {
            this.attempts = 0;
        }

        this.lastAttemptTime = now;
        this.attempts++;

        // Hash and verify password
        const hashedPassword = await this.hashPassword(password);
        if (hashedPassword === launchConfig.adminHash) {
            this.isLoggedIn = true;
            this.sessionStartTime = now;
            this.saveSession();
            return true;
        }

        throw new Error('Invalid password');
    }

    // Check if session is valid
    validateSession() {
        if (!this.isLoggedIn || !this.sessionStartTime) {
            return false;
        }

        const now = Date.now();
        if (now - this.sessionStartTime > launchConfig.sessionTimeout) {
            this.logout();
            return false;
        }

        return true;
    }

    // Save session to localStorage
    saveSession() {
        const sessionData = {
            isLoggedIn: this.isLoggedIn,
            sessionStartTime: this.sessionStartTime
        };
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
    }

    // Load session from localStorage
    loadSession() {
        try {
            const saved = localStorage.getItem('adminSession');
            if (saved) {
                const data = JSON.parse(saved);
                this.isLoggedIn = data.isLoggedIn;
                this.sessionStartTime = data.sessionStartTime;
                return this.validateSession();
            }
        } catch (error) {
            console.error('Error loading admin session:', error);
        }
        return false;
    }

    // Logout
    logout() {
        this.isLoggedIn = false;
        this.sessionStartTime = null;
        localStorage.removeItem('adminSession');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminAuth;
} else {
    window.AdminAuth = AdminAuth;
}