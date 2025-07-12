// Particle System Module
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.emitters = [];
        this.enabled = true;
        this.maxParticles = 100;
        this.particleLifetime = 3000; // 3 seconds
    }

    init(game) {
        this.game = game;
        this.canvas = document.getElementById('particles');
        if (!this.canvas) {
            this.createParticleCanvas();
        }
        this.ctx = this.canvas.getContext('2d');
        this.startAnimation();
    }

    createParticleCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles';
        canvas.className = 'particles';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            particlesContainer.appendChild(canvas);
        }
        
        this.canvas = canvas;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, options = {}) {
        if (this.particles.length >= this.maxParticles) return;
        
        const particle = {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            vx: (options.vx || 0) + (Math.random() - 0.5) * 2,
            vy: (options.vy || 0) + (Math.random() - 0.5) * 2,
            size: options.size || Math.random() * 4 + 2,
            color: options.color || this.getRandomColor(),
            life: options.life || this.particleLifetime,
            maxLife: options.life || this.particleLifetime,
            type: options.type || 'circle',
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            gravity: options.gravity || 0.1,
            friction: options.friction || 0.98
        };
        
        this.particles.push(particle);
    }

    createClickParticles(x, y, damage) {
        const particleCount = Math.min(Math.floor(damage / 10) + 3, 15);
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                size: Math.random() * 6 + 3,
                color: this.getDamageColor(damage),
                life: 1000 + Math.random() * 1000,
                type: 'star',
                gravity: 0.2
            });
        }
    }

    createUpgradeParticles(x, y) {
        for (let i = 0; i < 20; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: Math.random() * 4 + 2,
                color: '#ffd700',
                life: 2000 + Math.random() * 1000,
                type: 'sparkle',
                gravity: 0.1
            });
        }
    }

    createLevelUpParticles(x, y) {
        for (let i = 0; i < 30; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 8 + 4,
                color: this.getRandomRainbowColor(),
                life: 3000 + Math.random() * 2000,
                type: 'circle',
                gravity: 0.05
            });
        }
    }

    createPrestigeParticles(x, y) {
        for (let i = 0; i < 50; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                size: Math.random() * 10 + 5,
                color: this.getRandomRainbowColor(),
                life: 5000 + Math.random() * 3000,
                type: 'star',
                gravity: 0.02
            });
        }
    }

    createBossParticles(x, y, bossType) {
        const colors = {
            goblin: '#8B4513',
            orc: '#228B22',
            troll: '#4B0082',
            dragon: '#FF4500',
            demon: '#8B0000'
        };
        
        const color = colors[bossType] || '#FF0000';
        
        for (let i = 0; i < 25; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                size: Math.random() * 6 + 3,
                color: color,
                life: 2500 + Math.random() * 1500,
                type: 'fire',
                gravity: 0.15
            });
        }
    }

    createAmbientParticles() {
        // Create floating particles in the background
        if (Math.random() < 0.1) {
            this.createParticle(null, null, {
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25,
                size: Math.random() * 2 + 1,
                color: 'rgba(255, 255, 255, 0.3)',
                life: 8000 + Math.random() * 4000,
                type: 'circle',
                gravity: 0
            });
        }
    }

    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply gravity
            particle.vy += particle.gravity;
            
            // Apply friction
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed;
            
            // Update life
            particle.life -= deltaTime;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    renderParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            switch (particle.type) {
                case 'circle':
                    this.renderCircle(particle);
                    break;
                case 'star':
                    this.renderStar(particle);
                    break;
                case 'sparkle':
                    this.renderSparkle(particle);
                    break;
                case 'fire':
                    this.renderFire(particle);
                    break;
                default:
                    this.renderCircle(particle);
            }
            
            this.ctx.restore();
        });
    }

    renderCircle(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderStar(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = Math.cos(angle) * particle.size;
            const y = Math.sin(angle) * particle.size;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    renderSparkle(particle) {
        this.ctx.strokeStyle = particle.color;
        this.ctx.lineWidth = 2;
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        // Draw cross
        this.ctx.beginPath();
        this.ctx.moveTo(-particle.size, 0);
        this.ctx.lineTo(particle.size, 0);
        this.ctx.moveTo(0, -particle.size);
        this.ctx.lineTo(0, particle.size);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    renderFire(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomRainbowColor() {
        const hue = Math.random() * 360;
        return `hsl(${hue}, 70%, 60%)`;
    }

    getDamageColor(damage) {
        if (damage >= 1000) return '#FF0000';
        if (damage >= 500) return '#FF6600';
        if (damage >= 100) return '#FFCC00';
        if (damage >= 50) return '#00FF00';
        return '#FFFFFF';
    }

    startAnimation() {
        let lastTime = 0;
        
        const animate = (currentTime) => {
            if (!this.enabled) return;
            
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            this.updateParticles(deltaTime);
            this.createAmbientParticles();
            this.renderParticles();
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    // Particle emitters for continuous effects
    createEmitter(x, y, options = {}) {
        const emitter = {
            x: x,
            y: y,
            active: true,
            rate: options.rate || 10,
            lastEmit: 0,
            particleOptions: options.particleOptions || {}
        };
        
        this.emitters.push(emitter);
        return emitter;
    }

    updateEmitters(deltaTime) {
        this.emitters.forEach(emitter => {
            if (!emitter.active) return;
            
            emitter.lastEmit += deltaTime;
            if (emitter.lastEmit >= 1000 / emitter.rate) {
                this.createParticle(emitter.x, emitter.y, emitter.particleOptions);
                emitter.lastEmit = 0;
            }
        });
    }

    // Weather effects
    createRainEffect() {
        for (let i = 0; i < 5; i++) {
            this.createParticle(
                Math.random() * this.canvas.width,
                -10,
                {
                    vx: 0,
                    vy: 3 + Math.random() * 2,
                    size: 1 + Math.random() * 2,
                    color: 'rgba(100, 150, 255, 0.6)',
                    life: 3000,
                    type: 'circle',
                    gravity: 0.1
                }
            );
        }
    }

    createSnowEffect() {
        for (let i = 0; i < 3; i++) {
            this.createParticle(
                Math.random() * this.canvas.width,
                -10,
                {
                    vx: (Math.random() - 0.5) * 1,
                    vy: 1 + Math.random() * 2,
                    size: 2 + Math.random() * 3,
                    color: 'rgba(255, 255, 255, 0.8)',
                    life: 5000,
                    type: 'circle',
                    gravity: 0.05
                }
            );
        }
    }

    createFireEffect() {
        for (let i = 0; i < 2; i++) {
            this.createParticle(
                Math.random() * this.canvas.width,
                this.canvas.height + 10,
                {
                    vx: (Math.random() - 0.5) * 2,
                    vy: -2 - Math.random() * 3,
                    size: 3 + Math.random() * 4,
                    color: `hsl(${20 + Math.random() * 20}, 100%, 50%)`,
                    life: 2000,
                    type: 'fire',
                    gravity: -0.1
                }
            );
        }
    }

    // Performance optimization
    setMaxParticles(max) {
        this.maxParticles = max;
    }

    clearParticles() {
        this.particles = [];
    }

    toggleParticles() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Export particle settings
    exportSettings() {
        return {
            enabled: this.enabled,
            maxParticles: this.maxParticles,
            particleLifetime: this.particleLifetime
        };
    }

    // Import particle settings
    importSettings(settings) {
        if (settings.enabled !== undefined) this.enabled = settings.enabled;
        if (settings.maxParticles) this.maxParticles = settings.maxParticles;
        if (settings.particleLifetime) this.particleLifetime = settings.particleLifetime;
    }
}

// Global particle system instance
window.ParticleSystem = ParticleSystem;