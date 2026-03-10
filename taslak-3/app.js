/**
 * app.js - Taslak 3 Interactions
 * Includes the flowing neural particle background and scroll reveals.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------------------------
     * 1. Canvas Neural Flow Background
     * ----------------------------------------------------------------- */
    const canvas = document.getElementById('neural-flow');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        
        const particles = [];
        const config = {
            particleCount: 50,
            baseRadius: 1.5,
            connectionRadius: 250,
            repelRadius: 100, // Mouse interaction
            primaryColor: 'rgba(216, 64, 64, 0.5)', // #D84040 with opacity
            secondaryColor: 'rgba(238, 238, 238, 0.2)' // #EEEEEE with opacity
        };

        const mouse = { x: -1000, y: -1000 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3; // Very slow
                this.vy = (Math.random() - 0.5) * 0.3; // Very slow
                this.baseX = this.x;
                this.baseY = this.y;
                this.isRed = Math.random() > 0.6; // 40% are red accents
            }

            update() {
                // Natural movement
                this.x += this.vx;
                this.y += this.vy;

                // Seamless screen wrapping
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Mouse interaction - gentle push
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.repelRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (config.repelRadius - distance) / config.repelRadius;
                    
                    this.x -= forceDirectionX * force * 2;
                    this.y -= forceDirectionY * force * 2;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, config.baseRadius, 0, Math.PI * 2);
                ctx.fillStyle = this.isRed ? config.primaryColor : config.secondaryColor;
                ctx.fill();
            }
        }

        // Init particles
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            // Slight trails
            ctx.fillStyle = 'rgba(29, 22, 22, 0.4)'; // Mixes with variable --bg-primary
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionRadius) {
                        const opacity = 1 - (distance / config.connectionRadius);
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        // If one of the connected particles is red, tint the line red
                        if (particles[i].isRed || particles[j].isRed) {
                            ctx.strokeStyle = `rgba(216, 64, 64, ${opacity * 0.15})`;
                        } else {
                            ctx.strokeStyle = `rgba(238, 238, 238, ${opacity * 0.05})`;
                        }
                        
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    /* -----------------------------------------------------------------
     * 2. Scroll Reveal Animations
     * ----------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    // Initial setup
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* -----------------------------------------------------------------
     * 3. Magnetic Button Hover Effect
     * ----------------------------------------------------------------- */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            
            // Move child text/bg more actively for parallax
            const btnText = btn.querySelector('.btn-text');
            if(btnText) btnText.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            const btnText = btn.querySelector('.btn-text');
            if(btnText) btnText.style.transform = 'translate(0px, 0px)';
        });
    });
});
