/**
 * Main JavaScript file for CryptoX website
 * Contains general functionality for the website
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCopyToClipboard();
    initSmoothScrolling();
    initMobileMenu();
    
    // Add fade-in animation to sections
    animateSections();
    
    // Initialize 3D model fallback
    init3DModelFallback();
});

/**
 * Initialize copy to clipboard functionality for contract address
 */
function initCopyToClipboard() {
    const copyBtn = document.querySelector('.copy-btn');
    const contractInput = document.querySelector('.contract-address input');
    
    if (copyBtn && contractInput) {
        copyBtn.addEventListener('click', function() {
            // Select the text field
            contractInput.select();
            contractInput.setSelectionRange(0, 99999); // For mobile devices
            
            // Copy the text inside the text field
            navigator.clipboard.writeText(contractInput.value)
                .then(() => {
                    // Visual feedback for successful copy
                    copyBtn.classList.add('copied');
                    
                    // Show tooltip or change button text temporarily
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<span style="color: #000;">Copied!</span>';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    }
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize mobile menu functionality
 * This is a placeholder - you can expand this for a hamburger menu on mobile
 */
function initMobileMenu() {
    // Placeholder for mobile menu implementation
    // You can add a hamburger menu button and toggle navigation visibility
    
    // Example implementation:
    // const menuButton = document.createElement('button');
    // menuButton.classList.add('mobile-menu-button');
    // menuButton.innerHTML = '<span></span><span></span><span></span>';
    // document.querySelector('.header-container').appendChild(menuButton);
    
    // menuButton.addEventListener('click', function() {
    //     document.querySelector('.main-nav').classList.toggle('active');
    // });
}

/**
 * Animate sections when they come into view
 */
function animateSections() {
    const sections = document.querySelectorAll('section');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 1s ease forwards';
                // Once the animation is applied, we don't need to observe this element anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: '-50px' // trigger 50px before the element enters the viewport
    });
    
    // Start observing each section
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
}

/**
 * Handle header visibility on scroll
 * Shows/hides header based on scroll direction
 */
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scrolling down & not at the top
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up or at the top
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true });

/**
 * Handle 3D model loading errors and fallback to static image
 */
function init3DModelFallback() {
    // Check if the model container exists
    const modelContainer = document.getElementById('hero-model-container');
    if (!modelContainer) return;
    
    // Add loading state
    modelContainer.classList.add('loading');
    
    // Check if we're running from file:// protocol (which can cause CORS issues)
    const isFileProtocol = window.location.protocol === 'file:';
    if (isFileProtocol) {
        console.warn('Running from file:// protocol. This may cause CORS issues with 3D models.');
        
        // Add a warning message to the page
        const warningEl = document.createElement('div');
        warningEl.className = 'cors-warning';
        warningEl.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 5px; z-index: 9999; max-width: 300px; font-size: 14px;';
        warningEl.innerHTML = `
            <h3 style="margin-top: 0; color: #ff9800;">3D Model Loading Warning</h3>
            <p>You're viewing this page using the file:// protocol, which may prevent 3D models from loading due to CORS restrictions.</p>
            <p>For best results, use a local server:</p>
            <ul style="padding-left: 20px;">
                <li>Python: <code>python -m http.server</code></li>
                <li>Node.js: <code>npx serve</code></li>
                <li>VS Code: Use "Live Server" extension</li>
            </ul>
            <button style="background: #ff9800; border: none; padding: 5px 10px; color: black; cursor: pointer; margin-top: 10px;" onclick="this.parentNode.style.display='none'">Dismiss</button>
        `;
        document.body.appendChild(warningEl);
    }
    
    // Listen for errors from the model-viewer script
    window.addEventListener('model-error', function(event) {
        // Check if it's a CORS error
        const isCorsError = event.detail && event.detail.isCorsError;
        showFallbackImage(isCorsError);
    });
    
    // Set a timeout to show fallback if model doesn't load within 10 seconds
    const modelTimeout = setTimeout(function() {
        // If Three.js hasn't created a canvas yet, show fallback
        if (!modelContainer.querySelector('canvas')) {
            showFallbackImage();
        }
    }, 10000);
    
    // Listen for successful model load
    window.addEventListener('model-loaded', function() {
        clearTimeout(modelTimeout);
        modelContainer.classList.remove('loading');
    });
    
    /**
     * Show the fallback image when 3D model fails to load
     * @param {boolean} isCorsError - Whether the error is a CORS error
     */
    function showFallbackImage(isCorsError) {
        console.log('3D model failed to load, showing fallback image');
        modelContainer.classList.remove('loading');
        modelContainer.classList.add('model-error');
        
        // Make sure the fallback image is visible
        const fallbackImage = modelContainer.querySelector('.fallback-image');
        if (fallbackImage) {
            fallbackImage.style.opacity = '1';
        }
        
        // If it's a CORS error, show a helpful message
        if (isCorsError) {
            // Create an error message element
            const errorMessage = document.createElement('div');
            errorMessage.className = 'model-error-message';
            errorMessage.style.cssText = 'position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px; font-size: 12px; text-align: center;';
            errorMessage.innerHTML = `
                <strong>CORS Error:</strong> To view 3D models, use a local server instead of opening the file directly.
            `;
            
            // Add the error message to the model container
            modelContainer.appendChild(errorMessage);
        }
    }
}
