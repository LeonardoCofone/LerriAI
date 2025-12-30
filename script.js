// ============================================
// LerriAI - Interactive JavaScript
// Fresh, Modern, Luminous Theme
// ============================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initNeuralCanvas();
    initCursorGlow();
    initMobileMenu();
    initSmoothScroll();
    initCounterAnimation();
    initScrollAnimations();
    initTiltEffect();
});

// ============================================
// NEURAL NETWORK CANVAS BACKGROUND
// ============================================
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize particles
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================
function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow || window.innerWidth < 768) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateGlow() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';
        
        requestAnimationFrame(updateGlow);
    }
    
    updateGlow();
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileBtn || !navLinks) return;
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = mobileBtn.querySelectorAll('span');
        if (mobileBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileBtn.classList.remove('active');
            const spans = mobileBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            e.preventDefault();
            
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}



function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    if (!counters.length) return;
    
    const animateCounter = (counter) => {
        const rawValue = counter.dataset.count;
        const target = parseFloat(rawValue);
        const isFloat = rawValue.includes('.');
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (target - start) * easeOutQuart;
            
            if (isFloat) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = rawValue;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .workflow-step, .benefit-item, .pricing-card, .contact-form'
    );
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// TILT EFFECT FOR CARDS
// ============================================
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (!tiltCards.length || window.innerWidth < 768) return;
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================
// UTILITY: Debounce
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// FORM VALIDATION (optional enhancement)
// ============================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const email = contactForm.querySelector('#email');
        const subject = contactForm.querySelector('#subject');
        const message = contactForm.querySelector('#message');
        
        let isValid = true;
        
        [email, subject, message].forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#f97316';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
}

// ============================================
// PRELOADER (optional)
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta-group, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// ============================================
// PARALLAX EFFECT FOR ORBS
// ============================================
if (window.innerWidth >= 768) {
    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.pageYOffset;
        const orbs = document.querySelectorAll('.hero-orb, .cta-orb');
        
        orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 10));
}