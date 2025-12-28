document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple reveal animation for sections
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });

    // Staggered animation for skills and projects
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-box, .project-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease-out ${index % 3 * 0.2}s, transform 0.5s ease-out ${index % 3 * 0.2}s`;
        staggerObserver.observe(item);
    });

    // Add visible class style dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .skill-box.visible,
        .project-item.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- ScrollSpy Logic ---
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const bottomNavLinks = document.querySelectorAll('.mobile-bottom-nav .nav-item');

    function setActiveLink(id) {
        // Desktop Nav
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });

        // Mobile Bottom Nav
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset for sticky header/bottom nav
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            setActiveLink(current);
        }
    });

    // --- Theme Toggle Logic ---
    const themeToggle = document.querySelector('.floating-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const htmlElement = document.documentElement;

    // Sync icon with current theme
    if (htmlElement.getAttribute('data-theme') === 'light') {
        themeIcon.classList.remove('fa-adjust');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        if (htmlElement.getAttribute('data-theme') === 'light') {
            // Switch to Dark
            htmlElement.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-adjust');
            localStorage.setItem('theme', 'dark');
        } else {
            // Switch to Light
            htmlElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-adjust');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Get In Touch Section Logic ---
    const mouseLight = document.getElementById('mouse-light');
    if (mouseLight) {
        document.addEventListener('mousemove', (e) => {
            mouseLight.style.left = e.clientX + 'px';
            mouseLight.style.top = e.clientY + 'px';
        });
    }

    // Staggered animation for Get In Touch cards
    const gitObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                gitObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.git-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
        gitObserver.observe(card);
    });

    // Add visible class style for git-cards dynamically
    const gitStyle = document.createElement('style');
    gitStyle.innerHTML = `
        .git-card.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(gitStyle);
});
