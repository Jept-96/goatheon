# 3D Models Directory

This directory is for 3D model files used in the website, particularly for the hero section.

## Supported Format

The website is configured to use GLB (GL Binary) files, which are binary files that contain 3D models and their associated assets (textures, animations, etc.) in a single file.

## Hero Model

The main 3D model used in the hero section should be named:

```
hero-model.glb
```

Place this file directly in this directory. The model viewer is configured to automatically load this file.

## Model Requirements

For optimal performance and appearance:

- **File Size**: Keep the file size under 5MB for faster loading
- **Polygons**: Aim for low to medium poly count (10,000-50,000 polygons)
- **Textures**: Use optimized textures (1024x1024 or smaller)
- **Animations**: Include animations if desired (they will play automatically)
- **Scale**: Model should be properly scaled (centered at origin)
- **Format**: Use glTF 2.0 binary (.glb) format

## Creating GLB Files

You can create GLB files using various 3D modeling software:

1. **Blender**: Export as glTF 2.0 (.glb)
2. **Maya**: Use the glTF exporter plugin
3. **3ds Max**: Use the glTF exporter plugin
4. **Online Converters**: Convert from other formats using tools like [glTF Transform](https://gltf-transform.donmccurdy.com/)

## Testing Your Model

After placing your GLB file in this directory, open the website to see it rendered in the hero section. If the model doesn't appear or doesn't look right, check the browser console for errors.

### Important: CORS Restrictions

Due to browser security restrictions (CORS policy), 3D models won't load when opening the HTML file directly from your file system using the `file://` protocol. You'll see the fallback image instead.

To properly view 3D models, you need to run the website using a local server:

1. See the `local-server-instructions.html` file in the root directory for detailed setup instructions
2. Common methods:
   - Python: `python -m http.server`
   - Node.js: `npx serve`
   - VS Code: Use the "Live Server" extension

When running from a local server, the URL will start with `http://` instead of `file://`.

## Resources for GLB Files

We've included a helpful resource page with information on where to find, create, and optimize GLB files:

```
assets/models/sample-glb-resources.html
```

Open this file in a web browser to view links to various tools and resources for working with GLB files.

## Fallback

If a 3D model fails to load, the website will automatically fall back to displaying the static hero image (`assets/images/hero-character.png`).
