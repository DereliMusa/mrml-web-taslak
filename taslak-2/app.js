/**
 * Abstract Organic Particle Background for Taslak 2
 * Creates a slow, dramatic flowing pattern matching the deep red theme.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('organic-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Config
    const particleCount = 40;
    const connectionDistance = 200;
    const particles = [];
    
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
            // Extremely slow, floating movement for dramatic effect
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.radius = Math.random() * 2 + 1;
            // Base color is a muted red
            this.color = `rgba(216, 64, 64, ${Math.random() * 0.5 + 0.1})`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Warp around screen instead of bouncing for a more continuous flow
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        // Subtle clear to allow slight trailing effect (organic feel)
        ctx.fillStyle = 'rgba(29, 22, 22, 0.2)'; // Match bg-primary slightly
        ctx.fillRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    
                    // Instead of straight lines, draw slight curves (bezier) to feel more biological
                    const midX = (particles[i].x + particles[j].x) / 2 + (Math.random() * 10 - 5);
                    const midY = (particles[i].y + particles[j].y) / 2 + (Math.random() * 10 - 5);
                    
                    ctx.quadraticCurveTo(midX, midY, particles[j].x, particles[j].y);
                    
                    // Deep red connection lines
                    ctx.strokeStyle = `rgba(142, 22, 22, ${opacity * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
