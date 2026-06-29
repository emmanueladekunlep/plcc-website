// ============================================
// PLCC - PRAYER LIFE CHRISTIAN CENTRE
// Main JavaScript
// ============================================

// ===== SPARKLE EFFECT =====
(function createSparkles() {
    var canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];
    var PARTICLE_COUNT = 60;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function Particle() {
        this.reset = function() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
            // Gold or white colors (gold primary)
            this.hue = Math.random() > 0.4 ? 45 : 210; // 45 = gold, 210 = soft blue
            this.saturation = 60 + Math.random() * 30;
            this.lightness = 60 + Math.random() * 30;
        };

        this.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.twinklePhase += this.twinkleSpeed;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            if (Math.random() < 0.005) {
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
            }
        };

        this.draw = function() {
            var twinkle = 0.6 + 0.4 * Math.sin(this.twinklePhase);
            var alpha = this.opacity * twinkle;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * twinkle, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(' + this.hue + ', ' + this.saturation + '%, ' + this.lightness + '%, ' + alpha + ')';
            ctx.fill();

            if (this.size > 2 && twinkle > 0.8) {
                ctx.shadowColor = 'hsla(' + this.hue + ', ' + this.saturation + '%, ' + this.lightness + '%, 0.2)';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        };
    }

    // Create particles
    for (var i = 0; i < PARTICLE_COUNT; i++) {
        var p = new Particle();
        p.reset();
        particles.push(p);
    }

    // Connect particles with lines
    function drawLines() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    var opacity = 0.12 * (1 - distance / 100);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(201, 160, 61, ' + opacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        drawLines();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', function() {
        resize();
        for (var i = 0; i < particles.length; i++) {
            particles[i].reset();
        }
    });
})();


// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});


// ===== MOBILE HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', function() {
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });

        // Close menu when clicking a link (mobile)
        var navLinks = navMenu.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    setTimeout(function() {
                        navMenu.classList.remove('open');
                        hamburger.classList.remove('active');
                    }, 200);
                }
            });
        }
    }

    // ===== ACTIVE NAV LINK =====
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('nav a');
    for (var i = 0; i < navLinks.length; i++) {
        var link = navLinks[i];
        var href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    }

    // ===== SMOOTH SCROLL FOR HASH LINKS =====
    var hashLinks = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < hashLinks.length; i++) {
        hashLinks[i].addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                var targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
});


// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
document.addEventListener('DOMContentLoaded', function() {
    var animateElements = document.querySelectorAll('.animate-fade, .animate-slide-left, .animate-slide-right');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.style.opacity = '1';
                }
            }
        }, { threshold: 0.1 });

        for (var i = 0; i < animateElements.length; i++) {
            observer.observe(animateElements[i]);
        }
    } else {
        // Fallback for older browsers
        for (var i = 0; i < animateElements.length; i++) {
            animateElements[i].style.opacity = '1';
        }
    }
});


// ===== DYNAMIC YEAR IN FOOTER =====
document.addEventListener('DOMContentLoaded', function() {
    var footerYear = document.querySelector('footer .footer-bottom p');
    if (footerYear) {
        var currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace('2026', currentYear);
    }
});


// ===== CONTACT FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var message = document.getElementById('message').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Show success message (in production, this would send the form)
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Optional: Log the form data
            console.log('Form submitted:');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Message:', message);
        });
    }
});


// ===== BUY ME A COFFEE BUTTON TRACKING =====
document.addEventListener('DOMContentLoaded', function() {
    var coffeeButtons = document.querySelectorAll('a[href*="buymeacoffee.com"]');
    for (var i = 0; i < coffeeButtons.length; i++) {
        coffeeButtons[i].addEventListener('click', function() {
            console.log('Buy Me a Coffee clicked - redirecting to support PLCC');
        });
    }
});


// ===== BUZZSPROUT PODCAST TRACKING =====
document.addEventListener('DOMContentLoaded', function() {
    var podcastLinks = document.querySelectorAll('a[href*="buzzsprout.com"]');
    for (var i = 0; i < podcastLinks.length; i++) {
        podcastLinks[i].addEventListener('click', function() {
            console.log('Podcast link clicked - redirecting to Buzzsprout');
        });
    }
});


console.log('Prayer Life Christian Centre website loaded successfully!');
console.log('PLCC - Liberating Souls. Making Disciples. Fulfilling Destinies.');