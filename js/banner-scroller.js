/**
 * Infinite Banner Scroller JavaScript
 * Creates a seamless infinite scrolling effect for the resistance banner
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initBannerScroller();
});

/**
 * Initialize the infinite banner scroller
 */
function initBannerScroller() {
    const bannerContainer = document.querySelector('.resistance-banner');
    const bannerContent = document.querySelector('.banner-content');
    
    if (!bannerContainer || !bannerContent) return;
    
    // Get all banner items
    const bannerItems = bannerContent.querySelectorAll('span:not(.separator)');
    if (bannerItems.length === 0) return;
    
    // Clone the banner items to create the infinite effect
    setupInfiniteBanner(bannerContent, bannerItems);
    
    // Add event listeners for pause on hover
    addHoverPauseEffect(bannerContainer, bannerContent);
    
    // Add resize listener to adjust animation if needed
    window.addEventListener('resize', function() {
        adjustBannerSpeed(bannerContent);
    });
}

/**
 * Clone items to create the infinite scrolling effect
 * @param {HTMLElement} bannerContent - The container for banner items
 * @param {NodeList} bannerItems - The collection of banner items
 */
function setupInfiniteBanner(bannerContent, bannerItems) {
    // Calculate the total width of the original content
    const contentWidth = bannerContent.scrollWidth;
    
    // Clone the entire content at least once to ensure seamless looping
    const clone = bannerContent.innerHTML;
    bannerContent.innerHTML = clone + clone;
    
    // Adjust the animation duration based on the content width
    adjustBannerSpeed(bannerContent);
}

/**
 * Adjust the animation speed based on the content width
 * @param {HTMLElement} bannerContent - The container for banner items
 */
function adjustBannerSpeed(bannerContent) {
    // Calculate the total width of the content
    const contentWidth = bannerContent.scrollWidth / 2; // Divide by 2 because we duplicated the content
    
    // Set animation duration based on content width
    // Adjust the divisor to control speed (higher = slower)
    const animationDuration = contentWidth / 80; // seconds
    
    // Apply the animation
    bannerContent.style.animationDuration = `${animationDuration}s`;
    bannerContent.style.animationName = 'banner-scroll-infinite';
    bannerContent.style.animationTimingFunction = 'linear';
    bannerContent.style.animationIterationCount = 'infinite';
}

/**
 * Add pause-on-hover effect to the banner
 * @param {HTMLElement} container - The banner container
 * @param {HTMLElement} content - The banner content with the animation
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
