/**
 * Admin Control Panel
 * Handles all admin panel functionality and UI interactions
 */

class AdminPanel {
    constructor() {
        this.auth = new AdminAuth();
        this.setupElements();
        this.setupEventListeners();
        this.checkSession();
    }

    // Get all required DOM elements
    setupElements() {
        // Sections
        this.loginSection = document.getElementById('loginSection');
        this.controlSection = document.getElementById('controlSection');

        // Forms and inputs
        this.loginForm = document.getElementById('loginForm');
        this.passwordInput = document.getElementById('password');
        this.loginError = document.getElementById('loginError');

        // Control buttons
        this.logoutBtn = document.getElementById('logoutBtn');
        this.toggleLaunchBtn = document.getElementById('toggleLaunch');
        this.togglePreviewBtn = document.getElementById('togglePreview');
        this.launchDateInput = document.getElementById('launchDate');
        this.setLaunchDateBtn = document.getElementById('setLaunchDate');

        // Status elements
        this.launchStatus = document.getElementById('launchStatus');
        this.previewStatus = document.getElementById('previewStatus');
        this.nextUnlock = document.getElementById('nextUnlock');
        this.unlockedCount = document.getElementById('unlockedCount');
    }

    // Set up all event listeners
    setupEventListeners() {
        // Login form submission
        this.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Logout button
        this.logoutBtn.addEventListener('click', () => this.handleLogout());

        // Launch controls
        this.toggleLaunchBtn.addEventListener('click', () => this.toggleLaunch());
        this.togglePreviewBtn.addEventListener('click', () => this.togglePreview());
        this.setLaunchDateBtn.addEventListener('click', () => this.setLaunchDate());

        // Status updates
        document.addEventListener('launchStateChanged', () => this.updateStatus());
    }

    // Check if user is already logged in
    checkSession() {
        if (this.auth.loadSession() && this.auth.validateSession()) {
            this.showControlPanel();
            this.updateStatus();
        } else {
            this.showLoginForm();
        }
    }

    // Handle login attempt
    async handleLogin() {
        try {
            const password = this.passwordInput.value;
            await this.auth.login(password);
            this.loginError.textContent = '';
            this.showControlPanel();
            this.updateStatus();
        } catch (error) {
            this.loginError.textContent = error.message;
        }
        this.passwordInput.value = '';
    }

    // Handle logout
    handleLogout() {
        this.auth.logout();
        this.showLoginForm();
    }

    // Show/hide UI sections
    showLoginForm() {
        this.loginSection.classList.remove('hidden');
        this.controlSection.classList.add('hidden');
    }

    showControlPanel() {
        this.loginSection.classList.add('hidden');
        this.controlSection.classList.remove('hidden');
    }

    // Toggle launch state
    toggleLaunch() {
        const isLaunched = launchConfig.isLaunched;
        launchConfig.setLaunchState(!isLaunched);
        this.updateStatus();
    }

    // Toggle preview mode
    togglePreview() {
        const isPreview = launchConfig.previewMode;
        launchConfig.togglePreview(!isPreview);
        this.updateStatus();
    }

    // Set launch date
    setLaunchDate() {
        const dateStr = this.launchDateInput.value;
        if (!dateStr) {
            return;
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return;
        }

        launchConfig.setLaunchState(true, date.toISOString());
        this.updateStatus();
    }

    // Update all status displays
    updateStatus() {
        // Update launch status
        this.launchStatus.textContent = launchConfig.isLaunched ? 'Launched' : 'Not Launched';
        this.launchStatus.classList.toggle('active', launchConfig.isLaunched);
        this.toggleLaunchBtn.textContent = launchConfig.isLaunched ? 'Stop Launch' : 'Start Launch';

        // Update preview status
        this.previewStatus.textContent = launchConfig.previewMode ? 'Enabled' : 'Disabled';
        this.previewStatus.classList.toggle('active', launchConfig.previewMode);
        this.togglePreviewBtn.textContent = launchConfig.previewMode ? 'Disable Preview' : 'Enable Preview';

        // Update launch date if set
        if (launchConfig.launchDate) {
            const date = new Date(launchConfig.launchDate);
            this.launchDateInput.value = date.toISOString().slice(0, 16);
        }

        // Update timer display
        this.updateTimer();
    }

    // Update timer display
    updateTimer() {
        if (!launchConfig.isLaunched) {
            this.nextUnlock.textContent = '--:--:--';
            return;
        }

        // TODO: Add timer update logic when gallery timer is integrated
        this.nextUnlock.textContent = 'Running';
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});