document.addEventListener('DOMContentLoaded', () => {
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create a container for the canvas
    const container = document.createElement('div');
    container.id = 'canvas-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '0'; // Behind content, but visible
    container.style.pointerEvents = 'none'; // Allow clicking through
    document.body.prepend(container);
    container.appendChild(renderer.domElement);

    // --- Theme Management ---
    const themes = {
        dark: {
            particle: 0x38bdf8, // Sky Blue
            line: 0x38bdf8,
            sphere: 0x38bdf8,
            torus: 0x38bdf8
        },
        light: {
            particle: 0x0f172a, // Dark Slate (High Contrast)
            line: 0x0f172a,
            sphere: 0x0284c7, // Darker Blue
            torus: 0x0284c7
        }
    };

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    let currentTheme = getCurrentTheme();

    // --- Hero Section: Neural Network Particles ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; // Increased for warp effect
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30; // Spread particles wider
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material for particles
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: themes[currentTheme].particle,
        transparent: true,
        opacity: 0.8,
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Connecting Lines (Neural Network effect) - Placeholder logic
    // We'll use a wireframe sphere instead for performance and aesthetics
    const sphereGeometry = new THREE.IcosahedronGeometry(4, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: themes[currentTheme].sphere,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // --- Skills Section: Floating Shapes ---
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: themes[currentTheme].torus,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(5, -5, -5); // Positioned away initially
    scene.add(torus);

    // --- Camera Positioning ---
    camera.position.z = 5;

    // --- Warp Speed Logic ---
    let isWarping = false;
    let warpSpeed = 0;
    const targetWarpSpeed = 0.5; // Speed during warp

    window.setWarpSpeed = (enable) => {
        isWarping = enable;
    };

    // --- Mouse Interaction ---
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // --- Scroll Interaction ---
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // --- Theme Update Listener ---
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const newTheme = getCurrentTheme();
                if (newTheme !== currentTheme) {
                    currentTheme = newTheme;
                    updateThemeColors();
                }
            }
        });
    });

    observer.observe(document.documentElement, { attributes: true });

    function updateThemeColors() {
        const colors = themes[currentTheme];
        particlesMaterial.color.setHex(colors.particle);
        sphereMaterial.color.setHex(colors.sphere);
        torusMaterial.color.setHex(colors.torus);
    }

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Warp Effect Logic
        if (isWarping) {
            warpSpeed = THREE.MathUtils.lerp(warpSpeed, targetWarpSpeed, 0.05);
        } else {
            warpSpeed = THREE.MathUtils.lerp(warpSpeed, 0, 0.05);
        }

        if (warpSpeed > 0.01) {
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < particlesCount; i++) {
                // Move particles towards camera (positive Z)
                positions[i * 3 + 2] += warpSpeed;

                // Reset particles if they pass the camera
                if (positions[i * 3 + 2] > 5) {
                    positions[i * 3 + 2] = -20; // Send back
                    // Randomize X and Y slightly for variety
                    positions[i * 3] = (Math.random() - 0.5) * 30;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                }
            }
            particlesGeometry.attributes.position.needsUpdate = true;

            // Stretch effect (optional, simple scale z)
            // particlesMesh.scale.z = 1 + warpSpeed * 5; 
        } else {
            // Normal Rotation
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = mouseY * 0.5;
            particlesMesh.rotation.y += mouseX * 0.5;
        }


        // Rotate Sphere
        sphere.rotation.x += 0.001;
        sphere.rotation.y += 0.001;

        // Rotate Torus
        torus.rotation.x -= 0.01;
        torus.rotation.y -= 0.005;

        // Scroll based transformations
        camera.position.y = -scrollY * 0.002;

        // Parallax effect for particles (only when not warping)
        if (!isWarping && warpSpeed < 0.01) {
            particlesMesh.position.y = scrollY * 0.001;
        }

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
