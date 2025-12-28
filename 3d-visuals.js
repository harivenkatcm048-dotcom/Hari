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
    container.style.zIndex = '-1'; // Behind everything
    container.style.pointerEvents = 'none'; // Allow clicking through
    document.body.prepend(container);
    container.appendChild(renderer.domElement);

    // --- Hero Section: Neural Network Particles ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread particles
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material for particles
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xccff00, // Accent color
        transparent: true,
        opacity: 0.8,
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Connecting Lines (Neural Network effect)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xccff00,
        transparent: true,
        opacity: 0.15
    });

    // We'll create lines dynamically in the animation loop or use a wireframe object
    // For performance, let's add a subtle wireframe sphere in the background
    const sphereGeometry = new THREE.IcosahedronGeometry(4, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xccff00,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // --- Skills Section: Floating Shapes ---
    // We can add more objects and toggle their visibility based on scroll
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xccff00,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(5, -5, -5); // Positioned away initially
    scene.add(torus);

    // --- Camera Positioning ---
    camera.position.z = 5;

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

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate Particles
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.5;
        particlesMesh.rotation.y += mouseX * 0.5;

        // Rotate Sphere
        sphere.rotation.x += 0.001;
        sphere.rotation.y += 0.001;

        // Rotate Torus
        torus.rotation.x -= 0.01;
        torus.rotation.y -= 0.005;

        // Scroll based transformations
        // Move camera slightly based on scroll
        camera.position.y = -scrollY * 0.002;

        // Toggle visibility/position based on sections (Simple logic)
        // Hero is at top (scrollY ~ 0)
        // Skills is further down

        // Parallax effect for particles
        particlesMesh.position.y = scrollY * 0.001;

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
