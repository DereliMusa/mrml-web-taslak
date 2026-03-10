/**
 * MrML Lab - Interactive Frontend Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavbar();
    initScrollReveal();
    initHeroParticles();
});

// Custom Glowing Cursor
function initCursor() {
    const cursor = document.querySelector('.cursor-glow');
    
    // Only initialized on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });
        });

        // Interactive hover effects
        const interactives = document.querySelectorAll('a, button, .glass-card, .floating-node');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.background = 'radial-gradient(circle, rgba(242, 97, 63, 0.15) 0%, rgba(12, 12, 12, 0) 70%)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'radial-gradient(circle, rgba(242, 97, 63, 0.08) 0%, rgba(12, 12, 12, 0) 70%)';
            });
        });
    } else {
        cursor.style.display = 'none';
    }
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll Reveal Animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed for one-time animation
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// Neural Network Particles Canvas Animation
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width, height, particles;
    const particleCount = window.innerWidth > 768 ? 80 : 40;
    
    // Config colors based on CSS vars
    const colors = {
        primary: '#9B3922',
        highlight: '#F2613F',
        muted: 'rgba(242, 97, 63, 0.2)'
    };
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.baseRadius = this.radius;
            // 20% chance to be a highlight node
            this.isHighlight = Math.random() > 0.8;
            this.color = this.isHighlight ? colors.highlight : colors.primary;
            this.pulseOp = Math.random() * Math.PI;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Pulse effect
            this.pulseOp += 0.05;
            this.radius = this.baseRadius + Math.sin(this.pulseOp) * 0.5;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            if (this.isHighlight) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(242, 97, 63, 0.1)';
                ctx.fill();
            }
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Connect nodes if close enough
                if (distance < 150) {
                    ctx.beginPath();
                    // Opacity based on distance
                    const opacity = 1 - (distance / 150);
                    ctx.strokeStyle = `rgba(155, 57, 34, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => {
        resize();
        initParticles(); // Re-distribute on resize
    });
    
    resize();
    initParticles();
    animate();
}
