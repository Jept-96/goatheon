/**
 * 3D Model Viewer for GLB files
 * Uses Three.js to render 3D models in the hero section
 */

// Global variables
let container, camera, scene, renderer, model;
let mixer, clock;
let animationId;

// Mouse interaction variables
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Rotation limits (in radians)
const MAX_ROTATION_X = 0.3; // Limit vertical rotation to about 17 degrees
const MAX_ROTATION_Y = 0.5; // Limit horizontal rotation to about 28 degrees

// Initialize the 3D model viewer
function initModelViewer() {
    // Get the container element
    container = document.getElementById('hero-model-container');
    if (!container) return;

    // Create a clock for animations
    clock = new THREE.Clock();

    // Create scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Create camera with a wider field of view and closer position for a larger model
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 2.5); // Even closer camera position to make model appear larger

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Enhanced lighting setup
    // Ambient light (overall illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Reduced brightness
    scene.add(ambientLight);

    // Main directional light (simulates sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Reduced intensity
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Secondary directional light from opposite angle
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Reduced intensity
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);

    // Add a front light to illuminate the face/front of the model
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.7); // Reduced intensity
    frontLight.position.set(0, 0, 2);
    scene.add(frontLight);

    // Add a top light for better overall illumination
    const topLight = new THREE.DirectionalLight(0xffffff, 0.4); // Reduced intensity
    topLight.position.set(0, 2, 0);
    scene.add(topLight);

    // Load the GLB model
    loadModel('assets/models/hero-model.glb');

    // Add window resize listener
    window.addEventListener('resize', onWindowResize);
    
    // Add mouse move listener for interactive rotation
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Update half window dimensions
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    // Start animation loop
    animate();
}

/**
 * Handle mouse movement to rotate the model
 */
function onDocumentMouseMove(event) {
    // Calculate mouse position relative to the center of the window
    // Divide by a larger number to slow down the movement
    mouseX = (event.clientX - windowHalfX) / 300; // Reduced sensitivity
    mouseY = (event.clientY - windowHalfY) / 300; // Reduced sensitivity
    
    // Clamp values to limit rotation range
    mouseX = Math.max(Math.min(mouseX, MAX_ROTATION_Y), -MAX_ROTATION_Y);
    mouseY = Math.max(Math.min(mouseY, MAX_ROTATION_X), -MAX_ROTATION_X);
}

// Load a GLB model
function loadModel(modelPath) {
    // Show loading indicator
    container.classList.add('loading');

    // Create a loader
    const loader = new THREE.GLTFLoader();
    
    // Check if we're running from file:// protocol (which can cause CORS issues)
    const isFileProtocol = window.location.protocol === 'file:';
    if (isFileProtocol) {
        console.warn('Running from file:// protocol. This may cause CORS issues with 3D models. Consider using a local server.');
    }
    
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
            
            // Scale the model to make it larger
            model.scale.set(1.8, 1.8, 1.8); // Increased scale from 1.5 to 1.8
            
            // Add the model to the scene
            scene.add(model);
            
            // Set up animations if they exist
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }
            
            // Apply materials enhancement for better lighting response
            model.traverse(function(child) {
                if (child.isMesh) {
                    // Ensure materials respond well to lighting
                    if (child.material) {
                        child.material.metalness = 0.3; // Reduce metalness for better diffuse lighting
                        child.material.roughness = 0.7; // Increase roughness to reduce harsh reflections
                        
                        // Reduced emissive property
                        if (!child.material.emissive) {
                            child.material.emissive = new THREE.Color(0x111111);
                        } else {
                            child.material.emissive.set(0x111111);
                        }
                        
                        // Ensure the material is updated
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            // Hide loading indicator
            container.classList.remove('loading');
            
            // Dispatch model loaded event
            window.dispatchEvent(new CustomEvent('model-loaded'));
        },
        function (xhr) {
            // Progress callback
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(percentComplete + '% loaded');
        },
        function (error) {
            // Error callback
            console.error('Error loading model:', error);
            
            // Dispatch model error event
            console.error('Error details:', error);
            
            // Check if it's a CORS error
            const errorString = error.toString();
            if (errorString.includes('CORS') || errorString.includes('Cross-Origin') || 
                (error.message && (error.message.includes('CORS') || error.message.includes('Cross-Origin')))) {
                console.error('CORS error detected. Try running the site using a local server instead of file:// protocol.');
                console.error('You can use: python -m http.server, npm serve, or any other local server.');
            }
            
            window.dispatchEvent(new CustomEvent('model-error', { 
                detail: { error: error, isCorsError: errorString.includes('CORS') || errorString.includes('Cross-Origin') }
            }));
        }
    );
}

// Handle window resize
function onWindowResize() {
    if (!container || !camera || !renderer) return;
    
    // Update window half dimensions for mouse interaction
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Update the mixer on each frame
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    // Update model rotation based on mouse position
    if (model) {
        // Correct the direction for both axes
        targetRotationY = mouseX; // Positive to match cursor direction
        targetRotationX = mouseY; // Positive to match cursor direction
        
        // Apply smooth damping to rotation (reduced speed)
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.03; // Slower transition
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.03; // Slower transition
        
        // Clamp the rotation to prevent exceeding limits
        model.rotation.x = Math.max(Math.min(model.rotation.x, MAX_ROTATION_X), -MAX_ROTATION_X);
        model.rotation.y = Math.max(Math.min(model.rotation.y, MAX_ROTATION_Y), -MAX_ROTATION_Y);
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Stop the animation and clean up resources
function stopModelViewer() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
    
    if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
    }
    
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('mousemove', onDocumentMouseMove);
}

// Initialize the model viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Make sure to include it before this script.');
        return;
    }
    
    // Initialize the model viewer
    initModelViewer();
});
