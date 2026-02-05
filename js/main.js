/**
 * O2-OMEGA — Main JavaScript
 * Handles: Dark mode, scroll animations, mobile menu,
 * neural mesh canvas, counter animations, smooth scroll
 */

(function () {
    'use strict';

    // === DOM Elements ===
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const nav = document.getElementById('nav');
    const meshCanvas = document.getElementById('meshCanvas');

    // === Theme Management ===
    function getStoredTheme() {
        return localStorage.getItem('o2-theme');
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('o2-theme', theme);
    }

    function toggleTheme() {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    // Initialize theme
    const storedTheme = getStoredTheme();
    if (storedTheme) {
        setTheme(storedTheme);
    }
    // Default is dark (set in HTML)

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // === Mobile Menu ===
    function toggleMobileMenu() {
        if (!mobileMenu || !mobileMenuToggle) return;
        var isActive = mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = isActive ? '' : 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuToggle) return;
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu-link, .mobile-menu-cta').forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // === Scroll-based Navigation ===
    var lastScrollY = 0;
    var ticking = false;

    function updateNav() {
        var scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var navHeight = nav ? nav.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Scroll Animations (Intersection Observer) ===
    var animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    // Stagger animations slightly
                    var delay = 0;
                    var siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                    siblings.forEach(function (el, i) {
                        if (el === entry.target) {
                            delay = i * 100;
                        }
                    });

                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, Math.min(delay, 400));

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all elements
        animateElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // === Counter Animation ===
    function animateCounter(element, target, duration) {
        var start = 0;
        var startTime = null;
        var isFloat = target % 1 !== 0;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function (ease-out-cubic)
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = eased * target;

            if (isFloat) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (isFloat) {
                    element.textContent = target.toFixed(1);
                } else {
                    element.textContent = target;
                }
            }
        }

        requestAnimationFrame(step);
    }

    // Observe stat numbers for counter animation
    var statNumbers = document.querySelectorAll('.stat-number[data-target]');

    if ('IntersectionObserver' in window && statNumbers.length > 0) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var target = parseFloat(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target, 2000);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(function (el) {
            counterObserver.observe(el);
        });
    }

    // === Neural Mesh Canvas ===
    function initNeuralMesh() {
        if (!meshCanvas) return;

        var ctx = meshCanvas.getContext('2d');
        var container = meshCanvas.parentElement;
        var particles = [];
        var particleCount = 40;
        var animationId;
        var isVisible = false;

        function resize() {
            var rect = container.getBoundingClientRect();
            meshCanvas.width = rect.width * (window.devicePixelRatio || 1);
            meshCanvas.height = rect.height * (window.devicePixelRatio || 1);
            meshCanvas.style.width = rect.width + 'px';
            meshCanvas.style.height = rect.height + 'px';
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        }

        function createParticles() {
            particles = [];
            var rect = container.getBoundingClientRect();
            for (var i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * rect.width,
                    y: Math.random() * rect.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        function draw() {
            var rect = container.getBoundingClientRect();
            var width = rect.width;
            var height = rect.height;

            ctx.clearRect(0, 0, width, height);

            var accentColor = getComputedStyle(html).getPropertyValue('--color-accent').trim() || '#2997ff';

            // Update and draw particles
            particles.forEach(function (p) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = accentColor;
                ctx.globalAlpha = 0.6;
                ctx.fill();
            });

            // Draw connections
            var maxDist = 100;
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = accentColor;
                        ctx.globalAlpha = 0.15 * (1 - dist / maxDist);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;

            if (isVisible) {
                animationId = requestAnimationFrame(draw);
            }
        }

        function start() {
            if (!isVisible) {
                isVisible = true;
                resize();
                createParticles();
                draw();
            }
        }

        function stop() {
            isVisible = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }

        // Observe visibility
        if ('IntersectionObserver' in window) {
            var meshObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        start();
                    } else {
                        stop();
                    }
                });
            }, { threshold: 0.1 });

            meshObserver.observe(container);
        } else {
            start();
        }

        window.addEventListener('resize', function () {
            if (isVisible) {
                resize();
                createParticles();
            }
        });
    }

    initNeuralMesh();

    // === Hero Particles ===
    function initHeroParticles() {
        var container = document.getElementById('heroParticles');
        if (!container) return;

        var particleCount = 30;
        var style = document.createElement('style');
        var keyframes = '';

        for (var i = 0; i < particleCount; i++) {
            var driftX = (Math.random() * 200 - 100).toFixed(1);
            var driftY = (Math.random() * -300 - 50).toFixed(1);
            keyframes += '@keyframes floatParticle' + i + ' { 0% { transform: translate(0, 0) scale(1); opacity: 0; } 10% { opacity: 0.3; } 90% { opacity: 0.3; } 100% { transform: translate(' + driftX + 'px, ' + driftY + 'px) scale(0); opacity: 0; } } ';

            var particle = document.createElement('div');
            particle.style.cssText = [
                'position: absolute',
                'width: ' + (Math.random() * 3 + 1) + 'px',
                'height: ' + (Math.random() * 3 + 1) + 'px',
                'background: var(--color-accent)',
                'border-radius: 50%',
                'opacity: ' + (Math.random() * 0.3 + 0.1),
                'left: ' + (Math.random() * 100) + '%',
                'top: ' + (Math.random() * 100) + '%',
                'animation: floatParticle' + i + ' ' + (Math.random() * 10 + 10) + 's linear infinite',
                'animation-delay: ' + (Math.random() * -20) + 's'
            ].join(';');
            container.appendChild(particle);
        }

        style.textContent = keyframes;
        document.head.appendChild(style);
    }

    initHeroParticles();

    // === Keyboard Accessibility ===
    document.addEventListener('keydown', function (e) {
        // Escape closes mobile menu
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

})();
