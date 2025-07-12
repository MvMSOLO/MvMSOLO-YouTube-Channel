// Epic Clicker Tycoon RPG - Clicking System

class ClickingSystem {
    constructor(game) {
        this.game = game;
        this.clickableObject = null;
        this.lastClickTime = 0;
        this.clickCombo = 0;
        this.comboTimer = 0;
        this.comboDecayTime = 2000; // 2 seconds
        this.criticalStreak = 0;
        this.luckyStreak = 0;
        
        // Click tracking
        this.clicksThisSecond = 0;
        this.lastSecond = Date.now();
        this.clickHistory = [];
        
        // Performance tracking
        this.fastestClick = 0;
        this.averageClickTime = 0;
        this.totalClickTime = 0;
        this.clickCount = 0;
    }
    
    async init() {
        console.log('👆 Clicking system initialized');
        
        this.clickableObject = document.getElementById('clickableObject');
        this.setupClickHandlers();
        this.setupTouchHandlers();
        this.setupKeyboardHandlers();
    }
    
    setupClickHandlers() {
        if (!this.clickableObject) return;
        
        // Mouse click handler
        this.clickableObject.addEventListener('click', (e) => {
            this.handleClick(e.clientX, e.clientY, 'mouse');
        });
        
        // Mouse down for visual feedback
        this.clickableObject.addEventListener('mousedown', () => {
            this.clickableObject.classList.add('clicking');
        });
        
        this.clickableObject.addEventListener('mouseup', () => {
            this.clickableObject.classList.remove('clicking');
        });
        
        // Mouse leave to remove clicking state
        this.clickableObject.addEventListener('mouseleave', () => {
            this.clickableObject.classList.remove('clicking');
        });
    }
    
    setupTouchHandlers() {
        if (!this.clickableObject) return;
        
        // Touch handler for mobile
        this.clickableObject.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.clickableObject.classList.add('clicking');
        });
        
        this.clickableObject.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.clickableObject.classList.remove('clicking');
            
            const touch = e.changedTouches[0];
            this.handleClick(touch.clientX, touch.clientY, 'touch');
        });
        
        this.clickableObject.addEventListener('touchcancel', () => {
            this.clickableObject.classList.remove('clicking');
        });
    }
    
    setupKeyboardHandlers() {
        // Spacebar and Enter for clicking
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                const rect = this.clickableObject.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                this.handleClick(centerX, centerY, 'keyboard');
            }
        });
    }
    
    handleClick(x, y, source) {
        const now = Date.now();
        
        // Calculate click timing
        const timeSinceLastClick = now - this.lastClickTime;
        this.lastClickTime = now;
        
        // Update click statistics
        this.updateClickStats(timeSinceLastClick);
        
        // Calculate damage
        const damage = this.calculateDamage();
        
        // Apply damage
        this.applyDamage(damage, x, y);
        
        // Update combo
        this.updateCombo(timeSinceLastClick);
        
        // Check for special events
        this.checkSpecialEvents(damage);
        
        // Update game state
        this.updateGameState(damage);
        
        // Create visual effects
        this.createClickEffects(x, y, damage, source);
        
        // Play sound effects
        this.playClickSound(damage);
        
        // Update UI
        this.updateClickUI();
    }
    
    calculateDamage() {
        let damage = this.game.gameState.clickPower;
        
        // Apply prestige multiplier
        damage *= this.game.gameState.prestigeMultiplier;
        
        // Apply upgrade multipliers
        const upgradeMultiplier = this.getUpgradeMultiplier();
        damage *= upgradeMultiplier;
        
        // Check for critical hit
        const criticalHit = this.checkCriticalHit();
        if (criticalHit) {
            damage *= criticalHit.multiplier;
            this.criticalStreak++;
        } else {
            this.criticalStreak = 0;
        }
        
        // Check for lucky click
        const luckyClick = this.checkLuckyClick();
        if (luckyClick) {
            damage *= luckyClick.multiplier;
            this.luckyStreak++;
        } else {
            this.luckyStreak = 0;
        }
        
        // Apply combo multiplier
        if (this.clickCombo > 1) {
            const comboMultiplier = 1 + (this.clickCombo - 1) * 0.1;
            damage *= comboMultiplier;
        }
        
        return Math.floor(damage);
    }
    
    getUpgradeMultiplier() {
        let multiplier = 1;
        
        // Add click power upgrades
        for (const [upgradeId, level] of Object.entries(this.game.gameState.upgrades)) {
            const upgrade = this.game.systems.upgrades.getUpgradeById(upgradeId);
            if (upgrade && upgrade.type === 'click_power') {
                multiplier *= Math.pow(upgrade.multiplier, level);
            }
        }
        
        return multiplier;
    }
    
    checkCriticalHit() {
        const criticalChance = this.getCriticalChance();
        if (Math.random() < criticalChance) {
            const criticalMultiplier = this.getCriticalMultiplier();
            return {
                type: 'critical',
                multiplier: criticalMultiplier,
                chance: criticalChance
            };
        }
        return null;
    }
    
    getCriticalChance() {
        return this.game.systems.upgrades.getCriticalChance();
    }
    
    getCriticalMultiplier() {
        return this.game.systems.upgrades.getCriticalMultiplier();
    }
    
    checkLuckyClick() {
        const luckyChance = this.game.systems.upgrades.getLuckyChance();
        if (Math.random() < luckyChance) {
            const luckyMultiplier = this.game.systems.upgrades.getLuckyMultiplier();
            return {
                type: 'lucky',
                multiplier: luckyMultiplier,
                chance: luckyChance
            };
        }
        return null;
    }
    
    getLuckyChance() {
        return this.game.systems.upgrades.getLuckyChance();
    }
    
    updateCombo(timeSinceLastClick) {
        if (timeSinceLastClick < 500) { // Within 500ms
            this.clickCombo++;
            this.comboTimer = Date.now();
        } else {
            this.clickCombo = 1;
        }
    }
    
    checkSpecialEvents(damage) {
        // Check for speed clicking achievement
        if (this.clickCombo >= 10) {
            this.game.systems.achievements.checkSpeedClicking();
        }
        
        // Check for lucky streak achievement
        if (this.luckyStreak >= 3) {
            this.game.systems.achievements.checkLuckyStreak();
        }
        
        // Check for critical streak achievement
        if (this.criticalStreak >= 5) {
            this.game.systems.achievements.checkCriticalStreak();
        }
    }
    
    applyDamage(damage, x, y) {
        // Add to total clicks
        this.game.gameState.totalClicks++;
        
        // Add to score
        this.game.gameState.score += damage;
        
        // Add coins (base 1 coin per click)
        const coinsEarned = Math.floor(damage * this.game.gameState.coinMultiplier);
        this.game.gameState.coins += coinsEarned;
        
        // Add diamonds (rare chance)
        if (Math.random() < 0.001) { // 0.1% chance
            this.game.gameState.diamonds += 1;
        }
        
        // Add XP
        const xpEarned = Math.floor(damage / 10);
        this.game.gameState.xp += xpEarned;
        
        // Update statistics
        this.game.gameState.stats.totalCoinsEarned += coinsEarned;
        this.game.gameState.stats.totalScoreEarned += damage;
    }
    
    updateClickStats(timeSinceLastClick) {
        // Update click count for this second
        const now = Date.now();
        if (now - this.lastSecond >= 1000) {
            this.game.gameState.clicksPerSecond = this.clicksThisSecond;
            this.clicksThisSecond = 0;
            this.lastSecond = now;
        }
        this.clicksThisSecond++;
        
        // Track click history
        this.clickHistory.push(now);
        if (this.clickHistory.length > 100) {
            this.clickHistory.shift();
        }
        
        // Update performance stats
        if (timeSinceLastClick > 0) {
            this.totalClickTime += timeSinceLastClick;
            this.clickCount++;
            this.averageClickTime = this.totalClickTime / this.clickCount;
            
            if (this.fastestClick === 0 || timeSinceLastClick < this.fastestClick) {
                this.fastestClick = timeSinceLastClick;
                this.game.gameState.stats.fastestClick = timeSinceLastClick;
            }
        }
    }
    
    createClickEffects(x, y, damage, source) {
        if (!this.game.gameState.settings.particleEffects) return;
        
        // Create damage text
        this.createDamageText(x, y, damage);
        
        // Create particles
        this.createParticles(x, y, damage);
        
        // Create click animation
        this.createClickAnimation(x, y, source);
        
        // Create screen shake for high damage
        if (damage > 100) {
            this.createScreenShake(damage);
        }
    }
    
    createDamageText(x, y, damage) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = this.game.formatNumber(damage);
        
        // Position the damage text
        damageText.style.left = `${x}px`;
        damageText.style.top = `${y}px`;
        
        // Add color based on damage
        if (damage > 1000) {
            damageText.style.color = '#ff4444';
            damageText.style.fontSize = '1.5rem';
        } else if (damage > 100) {
            damageText.style.color = '#ff8800';
            damageText.style.fontSize = '1.3rem';
        } else {
            damageText.style.color = '#ffffff';
        }
        
        document.body.appendChild(damageText);
        
        // Remove after animation
        setTimeout(() => {
            if (damageText.parentNode) {
                damageText.parentNode.removeChild(damageText);
            }
        }, 1000);
    }
    
    createParticles(x, y, damage) {
        const particleCount = Math.min(Math.floor(damage / 10), 20);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random particle properties
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 100;
            const size = 2 + Math.random() * 4;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = this.getParticleColor(damage);
            
            // Set animation properties
            particle.style.setProperty('--angle', angle);
            particle.style.setProperty('--velocity', velocity);
            
            document.body.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    getParticleColor(damage) {
        if (damage > 1000) return '#ff4444';
        if (damage > 100) return '#ff8800';
        if (damage > 50) return '#ffff00';
        return '#ffffff';
    }
    
    createClickAnimation(x, y, source) {
        // Add click animation to the clickable object
        this.clickableObject.classList.add('bounce');
        
        setTimeout(() => {
            this.clickableObject.classList.remove('bounce');
        }, 150);
    }
    
    createScreenShake(damage) {
        const intensity = Math.min(damage / 1000, 10);
        const shakeDuration = Math.min(intensity * 100, 500);
        
        document.body.style.animation = `shake ${shakeDuration}ms ease-in-out`;
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, shakeDuration);
    }
    
    playClickSound(damage) {
        const currentSkin = this.game.getCurrentSkin();
        if (currentSkin && currentSkin.sound) {
            this.game.systems.audio.playSound(currentSkin.sound);
        } else {
            this.game.systems.audio.playSound('click');
        }
        
        // Play special sounds for high damage
        if (damage > 1000) {
            this.game.systems.audio.playSound('critical');
        } else if (damage > 100) {
            this.game.systems.audio.playSound('powerful');
        }
    }
    
    updateClickUI() {
        // Update combo display
        if (this.clickCombo > 1) {
            this.showComboDisplay();
        }
        
        // Update click power display
        document.getElementById('clickPower').textContent = this.game.formatNumber(this.game.gameState.clickPower);
        
        // Update CPS display
        document.getElementById('cpsDisplay').textContent = this.game.formatNumber(this.game.gameState.clicksPerSecond);
        
        // Update total clicks display
        document.getElementById('totalClicks').textContent = this.game.formatNumber(this.game.gameState.totalClicks);
    }
    
    showComboDisplay() {
        // Create or update combo display
        let comboDisplay = document.getElementById('comboDisplay');
        if (!comboDisplay) {
            comboDisplay = document.createElement('div');
            comboDisplay.id = 'comboDisplay';
            comboDisplay.className = 'combo-display';
            document.body.appendChild(comboDisplay);
        }
        
        comboDisplay.textContent = `${this.clickCombo}x Combo!`;
        comboDisplay.style.display = 'block';
        
        // Hide after combo timer expires
        setTimeout(() => {
            if (Date.now() - this.comboTimer > this.comboDecayTime) {
                comboDisplay.style.display = 'none';
            }
        }, this.comboDecayTime);
    }
    
    update(deltaTime) {
        // Update combo timer
        if (Date.now() - this.comboTimer > this.comboDecayTime) {
            this.clickCombo = 0;
        }
        
        // Update auto clickers
        this.updateAutoClickers(deltaTime);
    }
    
    updateAutoClickers(deltaTime) {
        // Update auto clickers using the upgrade system
        const autoClickerCPS = this.game.systems.upgrades.getAutoClickerCPS();
        if (autoClickerCPS > 0) {
            const clicksThisFrame = autoClickerCPS * deltaTime;
            for (let i = 0; i < clicksThisFrame; i++) {
                this.handleAutoClick();
            }
        }
    }
    
    handleAutoClick() {
        // Simulate a click at the center of the clickable object
        const rect = this.clickableObject.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        this.handleClick(centerX, centerY, 'autoclicker');
    }
    
    // Developer console commands
    addCoins(amount) {
        this.game.gameState.coins += amount;
        this.game.showNotification(`💰 Added ${this.game.formatNumber(amount)} coins!`, 'success');
    }
    
    addDiamonds(amount) {
        this.game.gameState.diamonds += amount;
        this.game.showNotification(`💎 Added ${this.game.formatNumber(amount)} diamonds!`, 'success');
    }
    
    setClickPower(power) {
        this.game.gameState.clickPower = power;
        this.game.showNotification(`⚡ Click power set to ${this.game.formatNumber(power)}!`, 'success');
    }
    
    multiplyClickPower(multiplier) {
        this.game.gameState.clickPower *= multiplier;
        this.game.showNotification(`⚡ Click power multiplied by ${multiplier}!`, 'success');
    }
}