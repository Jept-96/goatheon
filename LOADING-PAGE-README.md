# Lip-Syncing Loading Page

This feature adds an engaging loading page with a lip-syncing 3D model that plays a speech before redirecting to the main website.

## How It Works

1. When a user visits the site, they are first directed to the loading page
2. The loading page displays the 3D model from the hero section
3. A tracker bar and timer show the audio playback progress
4. Once the model and audio are loaded, the speech audio plays
5. The 3D model's mouth animates in sync with the audio
6. The tracker bar fills up and the timer counts as the audio plays
7. After the speech completes, the user is automatically redirected to the main site

## File Structure

- `index.html` - Redirects to the loading page
- `loading.html` - The loading page with the lip-syncing 3D model
- `main-index.html` - The main website (original index.html content)
- `js/loading.js` - JavaScript for the loading page and lip-sync functionality
- `assets/audio/speech.mp3` - The speech audio file (you need to add this)

## Adding Your Speech Audio

1. Create or obtain an MP3 audio file of your speech (approximately 19 seconds)
2. Name it `speech.mp3`
3. Place it in the `assets/audio/` directory

## How the Lip-Syncing Works

The lip-syncing is implemented using the Web Audio API to analyze the audio in real-time:

1. The audio is analyzed using an analyzer node to detect amplitude changes
2. When the audio amplitude exceeds a threshold, the model's mouth opens
3. The mouth opening amount is proportional to the audio amplitude
4. Smoothing is applied to make the animation look more natural

The system automatically tries to find a suitable part of the 3D model to animate as the mouth:

1. It looks for mesh or bone objects with names containing "jaw", "mouth", "teeth", "tongue", or "head"
2. If none are found, it falls back to using the head or the first mesh in the model
3. The selected part is rotated to simulate mouth opening

## Customization Options

You can customize the lip-syncing behavior by modifying these constants in `js/loading.js`:

```javascript
const JAW_OPEN_AMOUNT = 0.3;    // Maximum rotation amount in radians
const AUDIO_THRESHOLD = 20;     // Threshold for mouth movement (0-255)
const SMOOTHING = 0.5;          // Smoothing factor (0-1)
```

## Browser Compatibility Notes

- Modern browsers have autoplay restrictions that may prevent the audio from playing automatically
- The loading page includes a fallback that will show a "Click anywhere to start" message if autoplay is blocked
- For best results, use a local server as described in the main README to avoid CORS issues with the 3D model and audio

## Troubleshooting

If the lip-syncing doesn't work as expected:

1. Check the browser console for errors
2. Ensure the audio file is properly formatted and placed in the correct directory
3. Try adjusting the `AUDIO_THRESHOLD` value in `js/loading.js` if the mouth doesn't move enough or moves too much
4. If using a different 3D model, you may need to adjust the `JAW_OPEN_AMOUNT` value

## Disabling the Loading Page

If you want to disable the loading page and go directly to the main site:

1. Rename `index.html` to something else (e.g., `redirect.html`)
2. Rename `main-index.html` to `index.html`
