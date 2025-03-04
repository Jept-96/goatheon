# Cryptocurrency Website Template

A modern, responsive cryptocurrency website template inspired by the SREBL design. This template features a dark theme with pixel-style typography, animated elements, and an infinite image scroller.

## Features

- **Modern Dark Theme**: Black background with white text and graphics
- **Pixel-Style Typography**: Large, blocky text for headings
- **Responsive Design**: Fully responsive layout that works on all devices
- **3D Model Support**: GLB model viewer for the hero section with fallback to static image
- **Infinite Image Scroller**: Continuous horizontal scrolling gallery with no reset
- **Interactive Elements**: Hover effects, animations, and smooth scrolling
- **Well-Structured Code**: Clean, commented HTML, CSS, and JavaScript
- **Easy to Customize**: Modular design with clear organization

## File Structure

```
crypto-website/
├── index.html              # Main HTML file
├── css/
│   ├── reset.css           # CSS reset for consistent styling
│   ├── style.css           # Main styles
│   └── animations.css      # Animation definitions
├── js/
│   ├── main.js             # Main JavaScript functionality
│   └── infinite-scroller.js # Infinite image scroller implementation
└── assets/
    ├── images/             # Image assets directory
    │   ├── social/         # Social media icons
    │   ├── roadmap-icons/  # Icons for roadmap section
    │   ├── roadmap-cards/  # Images for roadmap cards
    │   ├── how-to-buy-icons/ # Icons for how to buy section
    │   └── scroller/       # Images for infinite scroller
    └── models/             # 3D model assets directory
```

## Getting Started

1. Replace placeholder images in the `assets/images/` directory with your own PNG images
2. Customize text content in `index.html`
3. Adjust colors and styling in `css/style.css` if desired
4. Open `index.html` in a web browser to view the website

## Customization

### Changing Colors

The color scheme can be modified by editing the CSS variables at the top of `style.css`:

```css
:root {
    /* Colors */
    --color-background: #000000;
    --color-text: #ffffff;
    --color-accent: #ffffff;
    --color-card-bg: rgba(30, 30, 30, 0.7);
    --color-button: #ffffff;
    --color-button-text: #000000;
    /* ... */
}
```

### Replacing Images

1. Prepare your PNG images with appropriate dimensions
2. Replace the placeholder images in the `assets/images/` directory
3. Make sure to maintain the same filenames or update the references in the HTML

### 3D Model Support

The website supports GLB (GL Binary) 3D models in the hero section:

1. Place your GLB model file in the `assets/models/` directory with the name `hero-model.glb`
2. The model will automatically be loaded and displayed with a slow rotation
3. If the model includes animations, they will play automatically
4. If the model fails to load, the static image (`assets/images/hero-character.png`) will be shown as a fallback

#### Important: Running with a Local Server

Due to browser security restrictions (CORS policy), 3D models won't load when opening the HTML file directly from your file system using the `file://` protocol. To properly view 3D models:

1. Run the website using a local server:
   - Python: `python -m http.server`
   - Node.js: `npx serve`
   - VS Code: Use the "Live Server" extension

2. Open the provided `local-server-instructions.html` file for detailed instructions on setting up a local server.

This is only required for viewing 3D models - the rest of the website will function normally when opened directly.

### Infinite Image Scroller

The infinite image scroller is configured in `js/infinite-scroller.js`. You can:

- Add more images by adding more `.scroller-item` elements in the HTML
- Adjust the scrolling speed by modifying the divisor in the `adjustScrollerSpeed` function
- Customize hover effects in `css/animations.css`

## Browser Compatibility

This template is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- Fonts: [Google Fonts](https://fonts.google.com/)
- Design Inspiration: SREBL website design

## License

This template is free to use for personal and commercial projects.

---

For any questions or support, please contact [your contact information].
#   3 . 7  
 