/**
 * Infinite Image Scroller JavaScript
 * Creates a seamless infinite scrolling effect for images
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initInfiniteScroller();
});

/**
 * Initialize the infinite image scroller
 */
function initInfiniteScroller() {
    const scrollerContainer = document.querySelector('.scroller-container');
    const scrollerContent = document.querySelector('.scroller-content');
    
    if (!scrollerContainer || !scrollerContent) return;
    
    // Get all scroller items
    const scrollerItems = document.querySelectorAll('.scroller-item');
    if (scrollerItems.length === 0) return;
    
    // Clone the scroller items to create the infinite effect
    setupInfiniteScroll(scrollerContent, scrollerItems);
    
    // Handle image loading
    handleImageLoading(scrollerItems);
    
    // Add event listeners for pause on hover
    addHoverPauseEffect(scrollerContainer, scrollerContent);
    
    // Add resize listener to adjust animation if needed
    window.addEventListener('resize', function() {
        adjustScrollerSpeed(scrollerContent, scrollerItems);
    });
}

/**
 * Clone items to create the infinite scrolling effect
 * @param {HTMLElement} scrollerContent - The container for scroller items
 * @param {NodeList} scrollerItems - The collection of scroller items
 */
function setupInfiniteScroll(scrollerContent, scrollerItems) {
    // Clone each item and append to the scroller content
    // We need enough clones to ensure a seamless loop
    const itemCount = scrollerItems.length;
    
    // Clone at least 2 sets of items to ensure smooth looping
    for (let i = 0; i < itemCount * 2; i++) {
        const clone = scrollerItems[i % itemCount].cloneNode(true);
        scrollerContent.appendChild(clone);
    }
    
    // Adjust the animation duration based on the number of items
    adjustScrollerSpeed(scrollerContent, scrollerItems);
}

/**
 * Adjust the animation speed based on the content width
 * @param {HTMLElement} scrollerContent - The container for scroller items
 * @param {NodeList} scrollerItems - The collection of original scroller items
 */
function adjustScrollerSpeed(scrollerContent, scrollerItems) {
    // Calculate the total width of all original items plus their gaps
    const itemWidth = 300; // Width of each item in pixels (from CSS)
    const gapWidth = 16; // Gap between items in pixels (from CSS --spacing-md)
    const totalItems = scrollerItems.length;
    
    // Calculate total width of all original items plus gaps
    const totalWidth = (itemWidth + gapWidth) * totalItems;
    
    // Set animation duration based on content width
    // Adjust the divisor to control speed (higher = slower)
    const animationDuration = totalWidth / 50; // seconds
    
    // Apply the animation duration
    scrollerContent.style.animationDuration = `${animationDuration}s`;
}

/**
 * Handle image loading to ensure proper dimensions
 * @param {NodeList} scrollerItems - The collection of scroller items
 */
function handleImageLoading(scrollerItems) {
    // Track loaded images to ensure all are loaded before starting animation
    let loadedImages = 0;
    const totalImages = scrollerItems.length;
    
    // For each original item, handle its image loading
    scrollerItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            // If image is already loaded
            if (img.complete) {
                imageLoaded();
            } else {
                // Wait for image to load
                img.addEventListener('load', imageLoaded);
                
                // Handle error case
                img.addEventListener('error', function() {
                    console.error('Error loading image:', img.src);
                    imageLoaded();
                });
            }
        } else {
            // No image in this item
            imageLoaded();
        }
    });
    
    function imageLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            // All original images are loaded, start the animation
            document.querySelector('.scroller-content').style.visibility = 'visible';
        }
    }
}

/**
 * Add pause-on-hover effect to the scroller
 * @param {HTMLElement} container - The scroller container
 * @param {HTMLElement} content - The scroller content with the animation
 */
function addHoverPauseEffect(container, content) {
    // Pause animation on hover
    container.addEventListener('mouseenter', function() {
        content.style.animationPlayState = 'paused';
    });
    
    // Resume animation when mouse leaves
    container.addEventListener('mouseleave', function() {
        content.style.animationPlayState = 'running';
    });
}

/**
 * Handle animation reset for seamless looping
 * This is a fallback in case CSS animation doesn't loop perfectly
 */
function handleAnimationReset() {
    const scrollerContent = document.querySelector('.scroller-content');
    
    // Listen for animation iteration
    scrollerContent.addEventListener('animationiteration', function() {
        // If needed, you can add code here to handle any adjustments
        // when the animation completes one cycle
        console.log('Animation cycle completed');
    });
}

/**
 * Create placeholder images for testing
 * This function is only used during development and can be removed in production
 */
function createPlaceholderImages() {
    const scrollerContent = document.querySelector('.scroller-content');
    
    // Clear existing content
    scrollerContent.innerHTML = '';
    
    // Create placeholder items
    for (let i = 1; i <= 6; i++) {
        const item = document.createElement('div');
        item.classList.add('scroller-item');
        
        const img = document.createElement('img');
        // Use placeholder image service
        img.src = `https://via.placeholder.com/300x200/333/fff?text=Image+${i}`;
        img.alt = `Gallery Image ${i}`;
        
        item.appendChild(img);
        scrollerContent.appendChild(item);
    }
}
