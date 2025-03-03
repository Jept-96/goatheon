# Audio Files Directory

This directory is for audio files used in the website, particularly for the loading page speech.

## Speech Audio File

The main speech audio file used in the loading page should be named:

```
speech.mp3
```

Place this file directly in this directory. The loading page is configured to automatically load and play this file.

## Audio Requirements

For optimal performance and quality:

- **Format**: MP3 format is recommended for better compression and browser compatibility
- **Duration**: The current implementation is optimized for the ~19 second speech you mentioned
- **Quality**: 128-192 kbps is sufficient for speech audio
- **Volume**: Ensure the audio is normalized to a good volume level
- **Background**: Minimal background noise for better lip-sync detection

## Creating Your Speech Audio

You can create your speech audio using various tools:

1. **Professional Recording Software**: Audacity (free), Adobe Audition, etc.
2. **Online Text-to-Speech**: Services like Amazon Polly, Google Text-to-Speech
3. **Voice Recording Apps**: Most smartphones have built-in voice recording apps
4. **AI Voice Generators**: Various AI tools can generate realistic speech

## Testing Your Audio

After placing your MP3 file in this directory, open the loading.html page to see it in action with the lip-syncing 3D model. The page will automatically transition to the main site after the audio completes.

## Troubleshooting

If the audio doesn't play:
1. Make sure the file is named exactly "speech.mp3"
2. Ensure the file is a valid MP3 format
3. Try clicking on the page (some browsers require user interaction to play audio)
4. Check the browser console for any errors

## Browser Autoplay Policies

Modern browsers have strict autoplay policies that may prevent audio from playing automatically without user interaction. The loading page includes a fallback that will show a "Click anywhere to start" message if autoplay is blocked.

## Local Server Requirement

Like with 3D models, audio files may have CORS restrictions when opening the HTML file directly from your file system using the `file://` protocol. For best results, use a local server as described in the main README.
