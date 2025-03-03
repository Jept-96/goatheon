const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle root URL
  let url = req.url;
  if (url === '/') {
    url = '/gallery.html';
  }
  
  // Remove query parameters
  const queryParamIndex = url.indexOf('?');
  if (queryParamIndex !== -1) {
    url = url.substring(0, queryParamIndex);
  }
  
  // Get the file path
  const filePath = path.join(__dirname, url);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    
    // Get file extension
    const ext = path.extname(filePath);
    
    // Set content type
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(`Error reading file: ${err}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      
      // Clear localStorage if requested
      if (url === '/gallery.html' && req.url.includes('clear=true')) {
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Set-Cookie': 'clearLocalStorage=true; path=/'
        });
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
      }
      
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`To view the gallery with your updated NFT data, open: http://localhost:${PORT}/gallery.html`);
  console.log(`To clear localStorage and reload from nft-data.json, open: http://localhost:${PORT}/gallery.html?clear=true`);
  console.log('Press Ctrl+C to stop the server');
});
