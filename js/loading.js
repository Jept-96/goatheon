/**
 * Loading page with lip-syncing 3D model
 * This script handles:
 * 1. Loading the 3D model
 * 2. Playing the speech audio
 * 3. Analyzing audio to animate the model's mouth
 * 4. Transitioning to the main page after audio completes
 */

// Global variables
let container, camera, scene, renderer, model;
let mixer, clock, animationId;
let audioContext, analyser, dataArray;
let audioElement, audioSource;
let progressBar, loadingText, enterButton;
let isModelLoaded = false;
let isAudioLoaded = false;
let isLipSyncActive = false;

// Mouth animation variables
let jawBone = null;
let originalJawRotation = 0;
const JAW_OPEN_AMOUNT = 0.3; // Rotation amount in radians
const AUDIO_THRESHOLD = 20; // Threshold for mouth movement (0-255)
const SMOOTHING = 0.5; // Smoothing factor for mouth movement (0-1)
let currentJawOpening = 0;

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    container = document.getElementById('model-container');
    progressBar = document.getElementById('progress-bar');
    loadingText = document.getElementById('loading-text');
    audioElement = document.getElementById('speech-audio');
    enterButton = document.getElementById('enter-button');

    // Set up enter button click handler
    enterButton.addEventListener('click', handleEnterClick);
    
    // Set audio source
    document.getElementById('audio-source').src = 'assets/audio/speech.mp3';
    audioElement.load();
    
    // Initialize 3D scene
    initScene();
    
    // Initialize audio analyzer
    initAudioAnalyzer();
    
    // Load the 3D model
    loadModel('assets/models/hero-model.glb');
    
    // Add event listeners
    audioElement.addEventListener('canplaythrough', onAudioLoaded);
    audioElement.addEventListener('ended', onAudioEnded);
    
    // Start animation loop
    animate();
});


/**
 * Initialize the 3D scene
 */
function initScene() {
    // Create clock for animations
    clock = new THREE.Clock();
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent background
    
    // Create camera
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 2.5);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add lighting
    addLighting();
    
    // Add window resize listener
    window.addEventListener('resize', onWindowResize);
}

/**
 * Add lighting to the scene
 */
function addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Secondary directional light
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);
    
    // Front light
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.7);
    frontLight.position.set(0, 0, 2);
    scene.add(frontLight);
    
    // Top light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
    topLight.position.set(0, 2, 0);
    scene.add(topLight);
}

/**
 * Initialize the audio analyzer
 */
function initAudioAnalyzer() {
    try {
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create analyzer node
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        // Create buffer for frequency data
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Connect audio element to analyzer
        audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        
        console.log('Audio analyzer initialized');
    } catch (error) {
        console.error('Error initializing audio analyzer:', error);
    }
}

/**
 * Load the 3D model
 */
function loadModel(modelPath) {
    // Update loading text
    loadingText.textContent = 'Loading 3D model...';
    
    // Create a loader
    const loader = new THREE.GLTFLoader();
    
    // Load the model
    loader.load(
        modelPath,
        function (gltf) {
            // Success callback
            model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;
            
            // Scale the model
            model.scale.set(1.8, 1.8, 1.8);
            
            // Add the model to the scene
            scene.add(model);
            
            // Set up animations if they exist
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }
            
            // Find jaw bone or mouth parts for animation
            findJawBone(model);
            
            // Apply materials enhancement
            enhanceMaterials(model);
            
            // Mark model as loaded
            isModelLoaded = true;
            updateLoadingProgress();
            
            console.log('Model loaded successfully');
        },
        function (xhr) {
            // Progress callback
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            progressBar.style.width = percentComplete + '%';
            console.log(percentComplete + '% loaded');
        },
        function (error) {
            // Error callback
            console.error('Error loading model:', error);
            loadingText.textContent = 'Error loading 3D model. Please refresh the page.';
        }
    );
}

/**
 * Find jaw bone or mouth parts in the model
 */
function findJawBone(model) {
    // Search for common jaw/mouth bone names
    const jawBoneNames = ['jaw', 'mouth', 'teeth', 'tongue', 'head'];
    
    model.traverse(function(object) {
        // Check if this object's name contains any of the jaw bone names
        if (object.isMesh || object.isBone) {
            const lowerName = object.name.toLowerCase();
            for (const name of jawBoneNames) {
                if (lowerName.includes(name)) {
                    console.log('Found potential jaw/mouth part:', object.name);
                    jawBone = object;
                    
                    // Store original rotation
                    if (object.rotation) {
                        originalJawRotation = object.rotation.x;
                    }
                    
                    return;
                }
            }
        }
    });
    
    // If no jaw bone was found, use the head or first child of the model
    if (!jawBone) {
        console.log('No specific jaw bone found, using fallback');
        
        // Try to find the head
        model.traverse(function(object) {
            if ((object.isMesh || object.isBone) && object.name.toLowerCase().includes('head')) {
                jawBone = object;
                if (object.rotation) {
                    originalJawRotation = object.rotation.x;
                }
                return;
            }
        });
        
        // If still no jaw bone, use the first mesh
        if (!jawBone) {
            model.traverse(function(object) {
                if (object.isMesh && !jawBone) {
                    jawBone = object;
                    if (object.rotation) {
                        originalJawRotation = object.rotation.x;
                    }
                    return;
                }
            });
        }
    }
}

/**
 * Enhance materials for better lighting
 */
function enhanceMaterials(model) {
    model.traverse(function(child) {
        if (child.isMesh) {
            if (child.material) {
                child.material.metalness = 0.3;
                child.material.roughness = 0.7;
                
                if (!child.material.emissive) {
                    child.material.emissive = new THREE.Color(0x111111);
                } else {
                    child.material.emissive.set(0x111111);
                }
                
                child.material.needsUpdate = true;
            }
        }
    });
}

/**
 * Handle window resize
 */
function onWindowResize() {
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Called when audio is loaded
 */
function onAudioLoaded() {
    console.log('Audio loaded');
    isAudioLoaded = true;
    updateLoadingProgress();
}

/**
 * Update loading progress and start when everything is ready
 */
function updateLoadingProgress() {
    if (isModelLoaded && isAudioLoaded) {
        loadingText.textContent = 'Ready!';
        progressBar.style.width = '100%';
    }
}

/**
 * Handle enter button click
 */
function handleEnterClick() {
    // Resume audio context if it's suspended (needed for Chrome)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Reset audio if it was playing
    if (!audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }

    // Update UI
    loadingText.textContent = 'Listening...';
    enterButton.disabled = true;
    enterButton.style.opacity = '0.5';
    enterButton.textContent = 'Listening...';

    // Play the audio
    audioElement.play()
        .then(() => {
            // Activate lip sync
            isLipSyncActive = true;
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            loadingText.textContent = 'Error playing audio. Please try again.';
            enterButton.disabled = false;
            enterButton.style.opacity = '1';
            enterButton.textContent = 'Goat Whispers';
        });
}

/**
 * Called when audio playback ends
 */
function onAudioEnded() {
    console.log('Audio playback ended');
    loadingText.textContent = 'Redirecting...';
    
    // Deactivate lip sync
    isLipSyncActive = false;
    
    // Reset jaw position
    if (jawBone && jawBone.rotation) {
        jawBone.rotation.x = originalJawRotation;
    }
    
    // Add fade-out animation
    document.body.classList.add('fade-out');
    
    // Redirect after fade-out completes
    setTimeout(() => {
        window.location.href = '/home';
    }, 1000);
}

/**
 * Animate the mouth based on audio amplitude
 */
function animateMouth() {
    if (!isLipSyncActive || !analyser || !dataArray || !jawBone) return;
    
    // Get audio data
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average amplitude from lower frequencies (where speech usually is)
    let sum = 0;
    const lowerFreqBins = Math.min(32, dataArray.length); // Use first 32 bins or less
    
    for (let i = 0; i < lowerFreqBins; i++) {
        sum += dataArray[i];
    }
    
    const average = sum / lowerFreqBins;
    
    // Determine target jaw opening based on amplitude
    let targetOpening = 0;
    
    if (average > AUDIO_THRESHOLD) {
        // Map the amplitude to a jaw opening amount
        // Clamp between 0 and 1, then multiply by max opening amount
        const normalizedAmplitude = Math.min(1, (average - AUDIO_THRESHOLD) / (255 - AUDIO_THRESHOLD));
        targetOpening = normalizedAmplitude * JAW_OPEN_AMOUNT;
    }
    
    // Smooth the jaw movement
    currentJawOpening = currentJawOpening * SMOOTHING + targetOpening * (1 - SMOOTHING);
    
    // Apply rotation to jaw bone
    if (jawBone.rotation) {
        jawBone.rotation.x = originalJawRotation + currentJawOpening;
    }
}

/**
 * Animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Update the mixer on each frame
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    // Animate mouth based on audio
    animateMouth();
    
    // Render the scene
    renderer.render(scene, camera);
}

/**
 * Clean up resources
 */
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
    
    if (audioContext) {
        audioContext.close();
    }
    
    window.removeEventListener('resize', onWindowResize);
}
