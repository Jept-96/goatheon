
/**

Admin Control Panel
Handles all admin panel functionality and UI interactions */
class AdminPanel {
constructor() {
this.auth = new AdminAuth();
this.setupElements();
this.setupEventListeners();
this.checkSession();

    // Listen for timer state updates
    socket.on('timerState', (state) => {
        console.log('Received timer state:', state);
        this.updateTimerDisplay(state);
        this.syncStateFromServer(state);
    });

    // Request initial state
    socket.emit('requestState');
}

setupElements() {
    this.loginSection = document.getElementById('loginSection');
    this.controlSection = document.getElementById('controlSection');
    this.loginForm = document.getElementById('loginForm');
    this.passwordInput = document.getElementById('password');
    this.loginError = document.getElementById('loginError');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.toggleLaunchBtn = document.getElementById('toggleLaunch');
    this.togglePreviewBtn = document.getElementById('togglePreview');
    this.launchDateInput = document.getElementById('launchDate');
    this.setLaunchDateBtn = document.getElementById('setLaunchDate');
    this.launchStatus = document.getElementById('launchStatus');
    this.previewStatus = document.getElementById('previewStatus');
    this.nextUnlock = document.getElementById('nextUnlock');
}

setupEventListeners() {
    this.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleLogin();
    });

    this.logoutBtn.addEventListener('click', () => this.handleLogout());
    this.toggleLaunchBtn.addEventListener('click', () => this.toggleLaunch());
    this.togglePreviewBtn.addEventListener('click', () => this.togglePreview());
    this.setLaunchDateBtn.addEventListener('click', () => this.setLaunchDate());

    // Listen for server state changes
    socket.on('timerStateChanged', (state) => {
        console.log('Server state changed:', state);
        this.syncStateFromServer(state);
    });
}

syncStateFromServer(state) {
    if (!state) return;
    
    // Update local config
    if (state.isLaunched !== undefined) {
        launchConfig.isLaunched = state.isLaunched;
    }
    if (state.launchDate !== undefined) {
        launchConfig.launchDate = state.launchDate;
    }
    if (state.previewMode !== undefined) {
        launchConfig.previewMode = state.previewMode;
    }

    // Update UI
    this.updateStatus();
    this.updateTimerDisplay(state);
}

checkSession() {
    if (this.auth.validateSession()) {
        this.showControlPanel();
        socket.emit('requestState');
    } else {
        this.showLoginForm();
    }
}

async handleLogin() {
    try {
        const password = this.passwordInput.value;
        await this.auth.login(password);
        this.loginError.textContent = '';
        this.showControlPanel();
        socket.emit('requestState');
    } catch (error) {
        this.loginError.textContent = error.message;
    }
    this.passwordInput.value = '';
}

handleLogout() {
    this.auth.logout();
    this.showLoginForm();
}

showLoginForm() {
    this.loginSection.classList.remove('hidden');
    this.controlSection.classList.add('hidden');
}

showControlPanel() {
    this.loginSection.classList.add('hidden');
    this.controlSection.classList.remove('hidden');
}

toggleLaunch() {
    const isLaunched = !launchConfig.isLaunched;
    const launchDate = this.launchDateInput.value || null;

    // Send to server first
    socket.emit('setLaunchState', {
        isLaunched: isLaunched,
        launchDate: launchDate
    });

    // Update local state
    launchConfig.setLaunchState(isLaunched, launchDate);
    this.updateStatus();
}

togglePreview() {
    const isPreview = !launchConfig.previewMode;
    
    // Send to server first
    socket.emit('togglePreview', isPreview);
    
    // Update local state
    launchConfig.togglePreview(isPreview);
    this.updateStatus();
}

setLaunchDate() {
    const dateStr = this.launchDateInput.value;
    if (!dateStr) return;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return;

    // Send to server first
    socket.emit('setLaunchState', {
        isLaunched: true,
        launchDate: date.toISOString()
    });

    // Update local state
    launchConfig.setLaunchState(true, date.toISOString());
    this.updateStatus();
}

updateStatus() {
    this.launchStatus.textContent = launchConfig.isLaunched ? 'Launched' : 'Not Launched';
    this.launchStatus.classList.toggle('active', launchConfig.isLaunched);
    this.toggleLaunchBtn.textContent = launchConfig.isLaunched ? 'Stop Launch' : 'Start Launch';

    this.previewStatus.textContent = launchConfig.previewMode ? 'Enabled' : 'Disabled';
    this.previewStatus.classList.toggle('active', launchConfig.previewMode);
    this.togglePreviewBtn.textContent = launchConfig.previewMode ? 'Disable Preview' : 'Enable Preview';

    if (launchConfig.launchDate) {
        const date = new Date(launchConfig.launchDate);
        this.launchDateInput.value = date.toISOString().slice(0, 16);
    }

    console.log('Status updated:', {
        isLaunched: launchConfig.isLaunched,
        previewMode: launchConfig.previewMode,
        launchDate: launchConfig.launchDate
    });
}

updateTimerDisplay(state) {
    if (!state || !state.isRunning) {
        this.nextUnlock.textContent = '--:--:--';
        return;
    }

    const now = Date.now();
    const timeUntilNext = Math.max(0, state.nextUnlockTime - now);
    const totalSeconds = Math.floor(timeUntilNext / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.nextUnlock.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
window.adminPanel = new AdminPanel();
});
