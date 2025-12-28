(function () {
    // Immediate execution
    const mainContent = document.getElementById('main-content');
    const heroCharan = document.getElementById('hero-name'); // Target element

    // Create Intro Overlay
    const introOverlay = document.createElement('div');
    introOverlay.id = 'intro-overlay';

    // Create Decorative Blobs
    const blob1 = document.createElement('div');
    blob1.className = 'intro-blob intro-blob-1';
    introOverlay.appendChild(blob1);

    const blob2 = document.createElement('div');
    blob2.className = 'intro-blob intro-blob-2';
    introOverlay.appendChild(blob2);

    // Create Text Wrapper
    const textWrapper = document.createElement('div');
    textWrapper.className = 'intro-text-wrapper';
    textWrapper.style.zIndex = '10'; // Above lines

    // Create Text
    const introText = document.createElement('h1');
    introText.className = 'intro-text';
    introText.textContent = 'HARI';

    // Assemble
    textWrapper.appendChild(introText);
    introOverlay.appendChild(textWrapper);
    document.body.appendChild(introOverlay);

    // --- 3D Warp Trigger ---
    // Wait for 3d-visuals.js to load and define setWarpSpeed
    const checkWarp = setInterval(() => {
        if (window.setWarpSpeed) {
            window.setWarpSpeed(true); // Engage Warp Drive
            clearInterval(checkWarp);
        }
    }, 100);

    // --- CSS Speed Lines (Restored) ---
    // Determine Theme for Colors
    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    const speedLineColor = isLightMode ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.15)';

    // Create Speed Lines Container
    const speedLinesContainer = document.createElement('div');
    speedLinesContainer.style.position = 'absolute';
    speedLinesContainer.style.width = '100%';
    speedLinesContainer.style.height = '100%';
    speedLinesContainer.style.overflow = 'hidden';
    speedLinesContainer.style.zIndex = '1';
    // Insert before text wrapper (which is z-index 10)
    introOverlay.insertBefore(speedLinesContainer, textWrapper);

    function createSpeedLine() {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = Math.random() * 2 + 1 + 'px';
        line.style.height = Math.random() * 150 + 50 + 'px';
        line.style.background = speedLineColor;
        line.style.left = Math.random() * 100 + '%';
        line.style.top = '100%';
        line.style.borderRadius = '2px';
        line.style.animation = `speedLine ${Math.random() * 0.4 + 0.2}s linear`;
        speedLinesContainer.appendChild(line);

        line.addEventListener('animationend', () => {
            line.remove();
        });
    }

    // Add keyframes for speed lines if not exists
    if (!document.getElementById('speed-line-style')) {
        const style = document.createElement('style');
        style.id = 'speed-line-style';
        style.textContent = `
            @keyframes speedLine {
                0% { transform: translateY(0); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(-150vh); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    let speedLineInterval = setInterval(createSpeedLine, 30);


    // --- Animation Sequence ---

    // 1. Text Reveal (CSS Animation)

    // 2. Letter Spacing Expansion (JS)
    setTimeout(() => {
        introText.style.transition = 'letter-spacing 1.5s ease-out, transform 1.5s ease-out';
        introText.style.letterSpacing = '1rem';
        introText.style.transform = 'scale(1.1)'; // Subtle scale up
    }, 100);

    // 3. FLIP Transition to Hero
    setTimeout(() => {

        // Disengage Warp Drive
        if (window.setWarpSpeed) {
            window.setWarpSpeed(false);
        }

        if (!heroCharan) {
            // Fallback if hero element not found
            introOverlay.style.opacity = '0';
            if (mainContent) {
                mainContent.style.transition = 'opacity 1.0s ease-in-out';
                mainContent.style.opacity = '1';
            }
            setTimeout(() => introOverlay.remove(), 800);
            return;
        }

        // Get Coordinates
        const startRect = introText.getBoundingClientRect();
        const endRect = heroCharan.getBoundingClientRect();

        // Remove CSS animation to allow manual control
        introText.style.animation = 'none';
        introText.style.transform = 'none';
        introText.style.letterSpacing = 'normal';

        // Prepare for transition
        introText.style.position = 'fixed';
        introText.style.left = startRect.left + 'px';
        introText.style.top = startRect.top + 'px';
        introText.style.margin = '0';
        introText.style.width = startRect.width + 'px';
        introText.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        introText.style.transformOrigin = 'top left';
        introText.style.zIndex = '100000'; // Ensure it stays on top during flight

        // Force reflow
        void introText.offsetWidth;

        // Execute Transition
        introText.style.left = endRect.left + 'px';
        introText.style.top = endRect.top + 'px';
        introText.style.fontSize = window.getComputedStyle(heroCharan).fontSize;
        introText.style.letterSpacing = window.getComputedStyle(heroCharan).letterSpacing;
        introText.style.color = window.getComputedStyle(heroCharan).color;
        // Remove gradient background for the text during transition to match hero text
        introText.style.background = 'none';
        introText.style.webkitTextFillColor = window.getComputedStyle(heroCharan).color;

        // Fade out overlay background (but keep text)
        introOverlay.style.transition = 'background-color 0.8s ease, backdrop-filter 0.8s ease';
        introOverlay.style.backgroundColor = 'transparent';
        introOverlay.style.backdropFilter = 'none';

        // Fade out blobs and lines
        blob1.style.opacity = '0';
        blob2.style.opacity = '0';
        if (speedLinesContainer) speedLinesContainer.style.opacity = '0';
        clearInterval(speedLineInterval);

        // Reveal Main Content (behind the moving text)
        if (mainContent) {
            mainContent.style.transition = 'opacity 0.5s ease-in-out';
            mainContent.style.opacity = '1';
        }

        // Cleanup after transition
        setTimeout(() => {
            heroCharan.style.opacity = '1'; // Show real text
            introText.style.opacity = '0'; // Hide flying text

            setTimeout(() => {
                if (introOverlay.parentNode) {
                    introOverlay.parentNode.removeChild(introOverlay);
                }
            }, 200);
        }, 800);

    }, 2200); // Start transition after 2.2s

})();
