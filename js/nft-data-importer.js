/**
 * NFT Data Importer
 * Utility for importing custom NFT data
 */

// NFT Data Importer
const nftDataImporter = {
    // Initialize importer
    init: function() {
        // Create UI if it doesn't exist
        this.createImporterUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        return this;
    },
    
    // Create importer UI
    createImporterUI: function() {
        // Check if UI already exists
        if (document.getElementById('nft-data-importer')) return;
        
        // Create importer container
        const importerContainer = document.createElement('div');
        importerContainer.id = 'nft-data-importer';
        importerContainer.className = 'nft-data-importer';
        
        // Create importer content
        importerContainer.innerHTML = `
            <div class="importer-header">
                <h2>NFT Data Importer</h2>
                <button id="close-importer" class="close-importer">&times;</button>
            </div>
            <div class="importer-body">
                <div class="importer-section">
                    <h3>Import from JSON</h3>
                    <p>Upload a JSON file with your NFT data or paste JSON directly.</p>
                    <div class="file-upload">
                        <input type="file" id="json-file-input" accept=".json">
                        <label for="json-file-input" class="file-upload-label">Choose JSON File</label>
                    </div>
                    <div class="json-paste">
                        <textarea id="json-paste-input" placeholder="Or paste JSON data here..."></textarea>
                    </div>
                    <button id="import-json-btn" class="import-btn">Import JSON Data</button>
                </div>
                <div class="importer-section">
                    <h3>Import Images</h3>
                    <p>Place your images in the <code>assets/images/gallery/</code> folder.</p>
                    <p>Name your images with the NFT ID (e.g., <code>1.jpg</code>, <code>2.png</code>, etc.).</p>
                    <p>Supported formats: JPG, PNG, GIF, WEBP</p>
                </div>
                <div class="importer-section">
                    <h3>JSON Format Example</h3>
                    <pre class="json-example">[
  {
    "id": 1,
    "title": "NFT Name 1",
    "description": "This is the story for NFT #1",
    "image": "assets/images/gallery/1.jpg"
  },
  {
    "id": 2,
    "title": "NFT Name 2",
    "description": "This is the story for NFT #2",
    "image": "assets/images/gallery/2.jpg"
  }
]</pre>
                </div>
                <div class="importer-section">
                    <h3>Single NFT Update</h3>
                    <div class="single-nft-form">
                        <div class="form-group">
                            <label for="nft-id-input">NFT ID (1-102):</label>
                            <input type="number" id="nft-id-input" min="1" max="102" placeholder="Enter NFT ID">
                        </div>
                        <div class="form-group">
                            <label for="nft-title-input">NFT Title:</label>
                            <input type="text" id="nft-title-input" placeholder="Enter NFT title">
                        </div>
                        <div class="form-group">
                            <label for="nft-description-input">NFT Description/Story:</label>
                            <textarea id="nft-description-input" placeholder="Enter NFT description or story"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="nft-image-input">Image Path:</label>
                            <input type="text" id="nft-image-input" placeholder="assets/images/gallery/1.jpg">
                        </div>
                        <button id="update-single-nft-btn" class="import-btn">Update NFT</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .nft-data-importer {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background-color: var(--color-card-bg);
                border-radius: var(--border-radius-lg);
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                z-index: 2000;
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .importer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-md);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .importer-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .close-importer {
                background: none;
                border: none;
                color: var(--color-text);
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            
            .close-importer:hover {
                opacity: 1;
            }
            
            .importer-body {
                padding: var(--spacing-md);
                overflow-y: auto;
                max-height: calc(90vh - 70px);
            }
            
            .importer-section {
                margin-bottom: var(--spacing-lg);
                padding-bottom: var(--spacing-md);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .importer-section:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }
            
            .importer-section h3 {
                margin-top: 0;
                margin-bottom: var(--spacing-sm);
                font-size: 1.2rem;
            }
            
            .file-upload {
                margin: var(--spacing-md) 0;
            }
            
            .file-upload input[type="file"] {
                display: none;
            }
            
            .file-upload-label {
                display: inline-block;
                background-color: var(--color-button);
                color: var(--color-button-text);
                padding: 0.8rem 1.5rem;
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .file-upload-label:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
            }
            
            .json-paste {
                margin: var(--spacing-md) 0;
            }
            
            .json-paste textarea {
                width: 100%;
                height: 150px;
                background-color: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-sm);
                color: var(--color-text);
                font-family: monospace;
                resize: vertical;
            }
            
            .import-btn {
                background-color: var(--color-button);
                color: var(--color-button-text);
                font-family: var(--font-heading);
                font-size: 0.9rem;
                padding: 0.8rem 1.5rem;
                border-radius: var(--border-radius-sm);
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: var(--spacing-sm);
            }
            
            .import-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
            }
            
            .json-example {
                background-color: rgba(0, 0, 0, 0.3);
                padding: var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                overflow-x: auto;
                font-family: monospace;
                font-size: 0.9rem;
                white-space: pre;
            }
            
            .form-group {
                margin-bottom: var(--spacing-sm);
            }
            
            .form-group label {
                display: block;
                margin-bottom: var(--spacing-xs);
                font-weight: bold;
            }
            
            .form-group input,
            .form-group textarea {
                width: 100%;
                background-color: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: var(--border-radius-sm);
                padding: 0.8rem;
                color: var(--color-text);
                font-family: var(--font-body);
            }
            
            .form-group textarea {
                height: 100px;
                resize: vertical;
            }
            
            .importer-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--color-button);
                color: var(--color-button-text);
                font-family: var(--font-heading);
                font-size: 0.9rem;
                padding: 0.8rem 1.5rem;
                border-radius: var(--border-radius-sm);
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .importer-toggle:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
            }
            
            @media (max-width: 768px) {
                .nft-data-importer {
                    width: 95%;
                }
            }
        `;
        
        // Add toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'importer-toggle';
        toggleButton.className = 'importer-toggle';
        toggleButton.textContent = 'Import NFT Data';
        
        // Append to body
        document.head.appendChild(style);
        document.body.appendChild(importerContainer);
        document.body.appendChild(toggleButton);
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Toggle importer
            const toggleButton = document.getElementById('importer-toggle');
            const importerContainer = document.getElementById('nft-data-importer');
            
            if (toggleButton && importerContainer) {
                toggleButton.addEventListener('click', () => {
                    importerContainer.style.display = 'flex';
                });
            }
            
            // Close importer
            const closeButton = document.getElementById('close-importer');
            if (closeButton && importerContainer) {
                closeButton.addEventListener('click', () => {
                    importerContainer.style.display = 'none';
                });
            }
            
            // Import JSON data
            const importJsonBtn = document.getElementById('import-json-btn');
            if (importJsonBtn) {
                importJsonBtn.addEventListener('click', () => {
                    this.importJsonData();
                });
            }
            
            // File input change
            const fileInput = document.getElementById('json-file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (event) => {
                    this.handleFileInput(event);
                });
            }
            
            // Update single NFT
            const updateSingleNftBtn = document.getElementById('update-single-nft-btn');
            if (updateSingleNftBtn) {
                updateSingleNftBtn.addEventListener('click', () => {
                    this.updateSingleNFT();
                });
            }
        });
    },
    
    // Handle file input
    handleFileInput: function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonPasteInput = document.getElementById('json-paste-input');
            if (jsonPasteInput) {
                jsonPasteInput.value = e.target.result;
            }
        };
        reader.readAsText(file);
    },
    
    // Import JSON data
    importJsonData: function() {
        const jsonPasteInput = document.getElementById('json-paste-input');
        if (!jsonPasteInput || !jsonPasteInput.value.trim()) {
            this.showNotification('Please enter JSON data', 'error');
            return;
        }
        
        try {
            const jsonData = jsonPasteInput.value.trim();
            const success = galleryData.importNFTData(jsonData);
            
            if (success) {
                this.showNotification('NFT data imported successfully', 'success');
                
                // Reload the page to reflect changes
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showNotification('Failed to import NFT data', 'error');
            }
        } catch (error) {
            console.error('Error importing JSON data:', error);
            this.showNotification('Invalid JSON format', 'error');
        }
    },
    
    // Update single NFT
    updateSingleNFT: function() {
        const idInput = document.getElementById('nft-id-input');
        const titleInput = document.getElementById('nft-title-input');
        const descriptionInput = document.getElementById('nft-description-input');
        const imageInput = document.getElementById('nft-image-input');
        
        if (!idInput || !idInput.value) {
            this.showNotification('Please enter an NFT ID', 'error');
            return;
        }
        
        const id = parseInt(idInput.value);
        if (isNaN(id) || id < 1 || id > galleryData.totalNFTs) {
            this.showNotification(`Invalid NFT ID. Must be between 1 and ${galleryData.totalNFTs}`, 'error');
            return;
        }
        
        // Create NFT data object
        const nftData = [{
            id: id,
            title: titleInput ? titleInput.value : undefined,
            description: descriptionInput ? descriptionInput.value : undefined,
            image: imageInput && imageInput.value ? imageInput.value : undefined
        }];
        
        // Update NFT data
        const success = galleryData.updateNFTData(nftData);
        
        if (success) {
            this.showNotification(`NFT #${id} updated successfully`, 'success');
            
            // Clear form
            if (idInput) idInput.value = '';
            if (titleInput) titleInput.value = '';
            if (descriptionInput) descriptionInput.value = '';
            if (imageInput) imageInput.value = '';
            
            // Reload the page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            this.showNotification('Failed to update NFT', 'error');
        }
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        if (typeof galleryUI !== 'undefined' && galleryUI.showNotification) {
            galleryUI.showNotification(message, type);
        } else {
            alert(message);
        }
    }
};

// Initialize importer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize importer
    nftDataImporter.init();
});
