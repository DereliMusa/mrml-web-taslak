/**
 * MrML Lab - Taslak 5
 * Custom Interactions and Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. NAVBAR SCROLL EFFECT
    ========================================= */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* =========================================
       2. SCROLL REVEAL ANIMATIONS
    ========================================= */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    // Check if element is in viewport
    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            
            if (elTop < triggerBottom) {
                // Check if element has a delay
                const delay = el.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
            }
        });
    };

    // Initial check and on scroll
    checkReveal();
    window.addEventListener('scroll', checkReveal);

    /* =========================================
       3. HERO CANVAS PARTICLES
    ========================================= */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = Math.min(width / 10, 150); // Responsive particle count
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                // Subtle gold/white colors for high-tech bio feel
                this.color = Math.random() > 0.8 ? 'rgba(198, 151, 73, 0.4)' : 'rgba(245, 245, 245, 0.2)';
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Init particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Draw connections between close particles
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(198, 151, 73, ${0.1 - distance/1200})`; // Faint gold lines
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };
        
        // Animation loop
        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            drawConnections();
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
        
        // Handle resize
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    /* =========================================
       4. PROJECTS SLIDER CONTROLS
    ========================================= */
    const track = document.getElementById('projects-track');
    const btnPrev = document.getElementById('proj-prev');
    const btnNext = document.getElementById('proj-next');
    
    if (track && btnPrev && btnNext) {
        // Amount to scroll (card width + gap)
        const scrollAmount = 480; 
        
        btnNext.addEventListener('click', () => {
            track.parentElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        btnPrev.addEventListener('click', () => {
            track.parentElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    /* =========================================
       5. TEAM NETWORK CANVAS (Static generative)
    ========================================= */
    const teamCanvas = document.getElementById('team-network-canvas');
    if (teamCanvas) {
        const tCtx = teamCanvas.getContext('2d');
        const container = teamCanvas.parentElement;
        
        const drawNetwork = () => {
            teamCanvas.width = container.offsetWidth;
            teamCanvas.height = container.offsetHeight;
            
            const w = teamCanvas.width;
            const h = teamCanvas.height;
            
            tCtx.clearRect(0, 0, w, h);
            
            // Draw abstract random connection lines
            const nodes = [];
            for (let i = 0; i < 20; i++) {
                nodes.push({
                    x: Math.random() * w,
                    y: Math.random() * h
                });
            }
            
            tCtx.lineWidth = 1;
            
            nodes.forEach((node, i) => {
                // Draw node point
                tCtx.fillStyle = 'rgba(198, 151, 73, 0.5)';
                tCtx.beginPath();
                tCtx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                tCtx.fill();
                
                // Connect to a few other nodes
                for (let j = i + 1; j < Math.min(i + 4, nodes.length); j++) {
                    const nextNode = nodes[j];
                    const dist = Math.hypot(node.x - nextNode.x, node.y - nextNode.y);
                    
                    if(dist < 300) {
                        tCtx.beginPath();
                        tCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                        tCtx.moveTo(node.x, node.y);
                        tCtx.lineTo(nextNode.x, nextNode.y);
                        tCtx.stroke();
                    }
                }
            });
            
            // Draw central prominent core lines simulating neural nets
            tCtx.beginPath();
            tCtx.strokeStyle = 'rgba(198, 151, 73, 0.15)';
            tCtx.lineWidth = 2;
            
            // Simulate connections to team nodes (PI central)
            const cx = w/2, cy = h/2;
            const px1 = w * 0.3, py1 = h * 0.2;
            const px2 = w * 0.25, py2 = h * 0.7;
            const px3 = w * 0.75, py3 = h * 0.3;
            
            tCtx.moveTo(cx, cy); tCtx.lineTo(px1, py1);
            tCtx.moveTo(cx, cy); tCtx.lineTo(px2, py2);
            tCtx.moveTo(cx, cy); tCtx.lineTo(px3, py3);
            tCtx.stroke();
        };
        
        drawNetwork();
        window.addEventListener('resize', drawNetwork);
    }
    
    /* =========================================
       6. MOBILE MENU TOGGLE (Basic implementation)
    ========================================= */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            // Very simple toggle - ideally would add a specific mobile class
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = '';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-secondary)';
                navLinks.style.padding = '20px';
                navLinks.style.gap = '20px';
            }
        });
    }
});
