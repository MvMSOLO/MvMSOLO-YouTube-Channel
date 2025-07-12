// Epic Clicker Tycoon RPG - Particle System

class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.maxParticles = 200;
        this.particleCanvas = null;
        this.particleCtx = null;
        this.isActive = true;
    }
    
    async init() {
        console.log('✨ Particle system initialized');
        this.createParticleCanvas();
        this.startParticleLoop();
    }
    
    createParticleCanvas() {
        // Create canvas for particles
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.id = 'particleCanvas';
        this.particleCanvas.style.position = 'fixed';
        this.particleCanvas.style.top = '0';
        this.particleCanvas.style.left = '0';
        this.particleCanvas.style.pointerEvents = 'none';
        this.particleCanvas.style.zIndex = '1000';
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
        
        document.body.appendChild(this.particleCanvas);
        this.particleCtx = this.particleCanvas.getContext('2d');
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.particleCanvas.width = window.innerWidth;
            this.particleCanvas.height = window.innerHeight;
        });
    }
    
    createClickParticles(x, y, damage, skin = null) {
        if (!this.isActive || !this.game.gameState.settings.particleEffects) return;
        
        const particleCount = Math.min(Math.floor(damage / 10) + 3, 15);
        const colors = this.getParticleColors(damage, skin);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'click',
                gravity: 0.3,
                friction: 0.98
            };
            
            this.particles.push(particle);
        }
    }
    
    createDamageParticles(x, y, damage, isCritical = false, isLucky = false) {
        if (!this.isActive || !this.game.gameState.settings.particleEffects) return;
        
        const particleCount = isCritical ? 8 : (isLucky ? 6 : 4);
        const colors = isCritical ? ['#ff4444', '#ff0000', '#ff6666'] : 
                      isLucky ? ['#44ff44', '#00ff00', '#66ff66'] : 
                      ['#ffffff', '#ffff00', '#ffaa00'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 3,
                life: 1.0,
                maxLife: 1.5,
                size: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'damage',
                gravity: 0.2,
                friction: 0.95,
                text: damage.toString()
            };
            
            this.particles.push(particle);
        }
    }
    
    createComboParticles(x, y, combo) {
        if (!this.isActive || !this.game.gameState.settings.particleEffects) return;
        
        const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff8800'];
        
        for (let i = 0; i < combo; i++) {
            const particle = {
                x: x + (Math.random() - 0.5) * 100,
                y: y + (Math.random() - 0.5) * 100,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 1,
                life: 1.0,
                maxLife: 2.0,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'combo',
                gravity: 0.1,
                friction: 0.99
            };
            
            this.particles.push(particle);
        }
    }
    
    createLevelUpParticles() {
        if (!this.isActive || !this.game.gameState.settings.particleEffects) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const colors = ['#ffd700', '#ffed4e', '#fff200', '#ffaa00'];
        
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            const speed = Math.random() * 5 + 3;
            
            const particle = {
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 3.0,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'levelup',
                gravity: 0.05,
                friction: 0.99
            };
            
            this.particles.push(particle);
        }
    }
    
    createAchievementParticles() {
        if (!this.isActive || !this.game.gameState.settings.particleEffects) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = Math.random() * 4 + 2;
            
            const particle = {
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 2.5,
                size: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'achievement',
                gravity: 0.1,
                friction: 0.98
            };
            
            this.particles.push(particle);
        }
    }
    
    createBossDefeatParticles() {
        if (!this.isActive || !this.game.gameState.settings.particleEffects) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const colors = ['#ff0000', '#ff4444', '#ff6666', '#ff8888', '#ffaaaa'];
        
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            
            const particle = {
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 4.0,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'bossdefeat',
                gravity: 0.2,
                friction: 0.97
            };
            
            this.particles.push(particle);
        }
    }
    
    createSkinChangeParticles(skin) {
        if (!this.isActive || !this.game.gameState.settings.particleEffects) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const colors = this.getSkinParticleColors(skin);
        
        for (let i = 0; i < 40; i++) {
            const angle = (Math.PI * 2 * i) / 40;
            const speed = Math.random() * 3 + 2;
            
            const particle = {
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 2.0,
                size: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'skinchange',
                gravity: 0.1,
                friction: 0.99
            };
            
            this.particles.push(particle);
        }
    }
    
    getParticleColors(damage, skin) {
        if (damage >= 1000) return ['#ff0000', '#ff4444', '#ff6666', '#ff8888'];
        if (damage >= 500) return ['#ff8800', '#ffaa00', '#ffcc00', '#ffdd00'];
        if (damage >= 100) return ['#ffff00', '#ffff44', '#ffff66', '#ffff88'];
        if (damage >= 50) return ['#00ff00', '#44ff44', '#66ff66', '#88ff88'];
        return ['#ffffff', '#dddddd', '#bbbbbb', '#999999'];
    }
    
    getSkinParticleColors(skin) {
        const skinColors = {
            'baby_dragon': ['#ff4444', '#ff6666', '#ff8888'],
            'phoenix': ['#ff0000', '#ff4400', '#ff8800'],
            'ice_queen': ['#00ffff', '#44ffff', '#88ffff'],
            'thunder_bird': ['#ffff00', '#ffff44', '#ffff88'],
            'cosmic_dragon': ['#8800ff', '#aa44ff', '#cc88ff'],
            'ancient_god': ['#ff00ff', '#ff44ff', '#ff88ff']
        };
        
        return skinColors[skin] || ['#ffffff', '#dddddd', '#bbbbbb'];
    }
    
    startParticleLoop() {
        const animate = () => {
            this.updateParticles();
            this.renderParticles();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateParticles() {
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
            
            // Update life
            particle.life -= 0.016; // 60 FPS
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Limit particle count
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }
    }
    
    renderParticles() {
        if (!this.particleCtx) return;
        
        // Clear canvas
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        // Render particles
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            const size = particle.size * alpha;
            
            this.particleCtx.save();
            this.particleCtx.globalAlpha = alpha;
            
            if (particle.type === 'damage' && particle.text) {
                // Render damage text
                this.particleCtx.fillStyle = particle.color;
                this.particleCtx.font = `${Math.max(12, size * 2)}px Arial`;
                this.particleCtx.textAlign = 'center';
                this.particleCtx.fillText(particle.text, particle.x, particle.y);
            } else {
                // Render particle circle
                this.particleCtx.fillStyle = particle.color;
                this.particleCtx.beginPath();
                this.particleCtx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                this.particleCtx.fill();
            }
            
            this.particleCtx.restore();
        }
    }
    
    clearParticles() {
        this.particles = [];
    }
    
    setActive(active) {
        this.isActive = active;
        if (!active) {
            this.clearParticles();
        }
    }
    
    update(deltaTime) {
        // Update particle system
    }
}