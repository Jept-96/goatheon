/**
 * Enhanced Page Protection Script
 */

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Disable text selection except for inputs
document.addEventListener('selectstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
    }
});

// Enhanced keyboard protection
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && (e.key === 'u' || e.keyCode === 85 || e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        return false;
    }
});

// DevTools detection
const devtools = { isOpen: false, orientation: undefined };
const threshold = 160;

setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
        window.location.reload();
    }
}, 1000);

// Debugger detection
setInterval(() => {
    const start = new Date();
    debugger;
    if (new Date() - start > 100) {
        window.location.reload();
    }
}, 1000);

// Style protection
const style = document.createElement('style');
style.textContent = `
    body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    img {
        pointer-events: none;
        -webkit-user-drag: none;
        user-drag: none;
    }
`;
document.head.appendChild(style);

console.log('Enhanced protection active');
