(function () {
    // Immediate execution
    const mainContent = document.getElementById('main-content');

    const introCanvas = document.createElement('canvas');
    introCanvas.id = 'intro-canvas';
    introCanvas.style.position = 'fixed';
    introCanvas.style.top = '0';
    introCanvas.style.left = '0';
    introCanvas.style.width = '100%';
    introCanvas.style.height = '100%';
    introCanvas.style.zIndex = '99999';
    // Transparent background to show website background
    introCanvas.style.backgroundColor = 'transparent';
    introCanvas.style.pointerEvents = 'none';
    document.body.appendChild(introCanvas);

    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        finishIntro();
        return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: introCanvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Clear transparent

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Bright White Point Light for reflections
    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    pointLight.position.set(-2, 1, 2);
    scene.add(pointLight);

    // --- Text Geometry ---
    const loader = new THREE.FontLoader();

    function finishIntro() {
        introCanvas.style.transition = 'opacity 0.8s ease-out';
        introCanvas.style.opacity = '0';
        setTimeout(() => {
            if (introCanvas.parentNode) introCanvas.parentNode.removeChild(introCanvas);
            if (mainContent) {
                mainContent.style.transition = 'opacity 1.0s ease-in-out';
                mainContent.style.opacity = '1';
                mainContent.classList.add('content-visible');
            }
        }, 800);
    }

    loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json',
        function (font) {
            const textGeometry = new THREE.TextGeometry('HARI', {
                font: font,
                size: 3,
                height: 0.5,
                curveSegments: 20,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.05,
                bevelOffset: 0,
                bevelSegments: 8
            });

            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            const centerOffset = - 0.5 * textWidth;
            textGeometry.translate(centerOffset, 0, 0);

            // Material - Glowing White Pop
            const textMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff, // Pure White
                emissive: 0xffffff, // White Glow
                emissiveIntensity: 0.4, // Intensity of glow
                metalness: 0.8, // Metallic feel
                roughness: 0.1, // Shiny
                clearcoat: 1.0,
                clearcoatRoughness: 0.0,
                reflectivity: 1.0,
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            scene.add(textMesh);

            // Camera Fit
            function fitCameraToText() {
                const aspect = window.innerWidth / window.innerHeight;
                const fov = camera.fov * (Math.PI / 180);
                let distance = (textWidth * 1.4 / 2) / (Math.tan(fov / 2) * aspect);
                distance = Math.max(distance, 15);
                return distance;
            }
            camera.position.z = fitCameraToText();

            // Animation Loop
            const clock = new THREE.Clock();
            let animationTime = 0;
            const totalDuration = 2.0;

            function animate() {
                const delta = clock.getDelta();
                animationTime += delta;

                // Camera Responsiveness
                const desiredZ = fitCameraToText();
                camera.position.z += (desiredZ - camera.position.z) * 0.1;

                // Text Animation
                if (animationTime < totalDuration) {
                    // Subtle float
                    textMesh.rotation.x = Math.sin(animationTime * 1.5) * 0.05;
                    textMesh.rotation.y = Math.cos(animationTime * 1.5) * 0.05;

                    // Light moves to create reflection changes
                    pointLight.position.x = Math.sin(animationTime * 2) * 10;
                    pointLight.position.y = Math.cos(animationTime * 2) * 5;
                }

                if (animationTime > 1.5) {
                    // Fade out
                    const fadeProgress = (animationTime - 1.5) / 0.5;
                    introCanvas.style.opacity = Math.max(0, 1 - fadeProgress);
                }

                if (animationTime > totalDuration) {
                    finishIntro();
                    return;
                }

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();
        },
        undefined,
        function (err) {
            console.error('Font loading failed', err);
            finishIntro();
        }
    );

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

})();
