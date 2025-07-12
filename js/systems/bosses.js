// Epic Clicker Tycoon RPG - Boss System

class BossSystem {
    constructor(game) {
        this.game = game;
        this.bosses = {};
        this.currentBoss = null;
        this.bossHealth = 0;
        this.maxBossHealth = 0;
        this.bossPhase = 'normal';
        this.bossAttackTimer = 0;
        this.bossAttackInterval = 5000; // 5 seconds
        this.bossEffects = [];
    }
    
    async init() {
        console.log('👹 Boss system initialized');
        await this.loadBosses();
        this.setupEventListeners();
        this.checkBossUnlocks();
    }
    
    async loadBosses() {
        try {
            const response = await fetch('config/bosses.json');
            const data = await response.json();
            this.bosses = data.bosses;
            console.log('👹 Bosses loaded successfully');
        } catch (error) {
            console.warn('Failed to load bosses config, using defaults');
            this.createDefaultBosses();
        }
    }
    
    createDefaultBosses() {
        this.bosses = {
            "goblin_chief": {
                "id": "goblin_chief",
                "name": "Goblin Chief",
                "emoji": "👹",
                "health": 1000,
                "damage": 10,
                "level": 5,
                "description": "A fierce goblin leader with a rusty sword",
                "abilities": ["sword_slash", "goblin_rage"],
                "rewards": {"coins": 500, "xp": 100, "diamonds": 5},
                "unlockRequirement": {"type": "level", "value": 5}
            },
            "ice_giant": {
                "id": "ice_giant",
                "name": "Ice Giant",
                "emoji": "🧊",
                "health": 5000,
                "damage": 25,
                "level": 15,
                "description": "A massive giant made of ice",
                "abilities": ["ice_slam", "frost_nova", "frozen_ground"],
                "rewards": {"coins": 2000, "xp": 500, "diamonds": 15},
                "unlockRequirement": {"type": "level", "value": 15}
            },
            "dragon_lord": {
                "id": "dragon_lord",
                "name": "Dragon Lord",
                "emoji": "🐉",
                "health": 25000,
                "damage": 100,
                "level": 30,
                "description": "A powerful dragon with ancient magic",
                "abilities": ["fire_breath", "wing_buffet", "dragon_roar", "magic_barrier"],
                "rewards": {"coins": 10000, "xp": 2000, "diamonds": 50},
                "unlockRequirement": {"type": "level", "value": 30}
            }
        };
    }
    
    setupEventListeners() {
        // Boss attack button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('boss-attack-btn')) {
                this.attackBoss();
            }
            
            if (e.target.classList.contains('boss-item')) {
                const bossId = e.target.dataset.boss;
                this.showBossDetails(bossId);
            }
        });
    }
    
    checkBossUnlocks() {
        const level = this.game.gameState.level;
        
        for (const [bossId, boss] of Object.entries(this.bosses)) {
            if (boss.unlockRequirement.type === 'level' && 
                level >= boss.unlockRequirement.value) {
                this.unlockBoss(bossId);
            }
        }
    }
    
    unlockBoss(bossId) {
        if (!this.game.gameState.unlockedBosses) {
            this.game.gameState.unlockedBosses = [];
        }
        
        if (!this.game.gameState.unlockedBosses.includes(bossId)) {
            this.game.gameState.unlockedBosses.push(bossId);
            this.game.showNotification(`👹 New boss unlocked: ${this.bosses[bossId].name}!`, 'success');
            this.updateBossDisplay();
        }
    }
    
    startBossFight(bossId) {
        const boss = this.bosses[bossId];
        if (!boss) return false;
        
        if (!this.game.gameState.unlockedBosses?.includes(bossId)) {
            this.game.showNotification('🔒 This boss is not unlocked yet!', 'error');
            return false;
        }
        
        this.currentBoss = boss;
        this.bossHealth = boss.health;
        this.maxBossHealth = boss.health;
        this.bossPhase = 'normal';
        this.bossAttackTimer = 0;
        this.bossEffects = [];
        
        this.game.showNotification(`👹 ${boss.name} appears!`, 'warning');
        this.game.systems.audio.playSound('boss_spawn');
        
        this.updateBossDisplay();
        return true;
    }
    
    attackBoss() {
        if (!this.currentBoss) return;
        
        // Calculate player damage
        const damage = this.game.systems.clicking.calculateDamage();
        
        // Apply damage to boss
        this.bossHealth -= damage;
        
        // Create damage effect
        this.createBossDamageEffect(damage);
        
        // Check for phase change
        this.checkBossPhase();
        
        // Check if boss is defeated
        if (this.bossHealth <= 0) {
            this.defeatBoss();
        } else {
            // Boss counter-attack
            this.bossAttack();
        }
        
        this.updateBossDisplay();
    }
    
    createBossDamageEffect(damage) {
        const effect = {
            id: Date.now(),
            damage: damage,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            life: 2.0
        };
        
        this.bossEffects.push(effect);
        
        // Create particle effect
        this.game.systems.particles.createDamageParticles(
            effect.x, effect.y, damage, false, false
        );
    }
    
    checkBossPhase() {
        const healthPercent = this.bossHealth / this.maxBossHealth;
        
        if (healthPercent <= 0.25 && this.bossPhase !== 'berserk') {
            this.bossPhase = 'berserk';
            this.bossAttackInterval = 2000; // Faster attacks
            this.game.showNotification(`💥 ${this.currentBoss.name} goes berserk!`, 'warning');
            this.game.systems.audio.playSound('boss_berserk');
        } else if (healthPercent <= 0.5 && this.bossPhase === 'normal') {
            this.bossPhase = 'enraged';
            this.bossAttackInterval = 3000; // Slightly faster attacks
            this.game.showNotification(`😡 ${this.currentBoss.name} becomes enraged!`, 'warning');
            this.game.systems.audio.playSound('boss_enrage');
        }
    }
    
    bossAttack() {
        if (!this.currentBoss) return;
        
        let damage = this.currentBoss.damage;
        
        // Phase multipliers
        if (this.bossPhase === 'enraged') damage *= 1.5;
        if (this.bossPhase === 'berserk') damage *= 2.5;
        
        // Apply damage to player (reduce coins)
        const coinLoss = Math.min(damage, this.game.gameState.coins);
        this.game.gameState.coins -= coinLoss;
        
        // Show damage effect
        this.game.showNotification(`💔 Boss deals ${coinLoss} damage!`, 'error');
        
        // Create screen shake effect
        this.game.systems.particles.createScreenShake(damage);
        
        // Play boss attack sound
        this.game.systems.audio.playSound('boss_attack');
    }
    
    defeatBoss() {
        if (!this.currentBoss) return;
        
        const boss = this.currentBoss;
        
        // Add to defeated bosses
        if (!this.game.gameState.defeatedBosses) {
            this.game.gameState.defeatedBosses = [];
        }
        this.game.gameState.defeatedBosses.push(boss.id);
        
        // Apply rewards
        if (boss.rewards) {
            if (boss.rewards.coins) {
                this.game.gameState.coins += boss.rewards.coins;
            }
            if (boss.rewards.diamonds) {
                this.game.gameState.diamonds += boss.rewards.diamonds;
            }
            if (boss.rewards.xp) {
                this.game.gameState.xp += boss.rewards.xp;
            }
        }
        
        // Show victory notification
        this.game.showNotification(
            `🎉 ${boss.name} defeated! +${boss.rewards.coins} coins, +${boss.rewards.xp} XP, +${boss.rewards.diamonds} diamonds`,
            'success'
        );
        
        // Create victory particles
        this.game.systems.particles.createBossDefeatParticles();
        
        // Play victory sound
        this.game.systems.audio.playSound('boss_defeat');
        
        // Reset boss fight
        this.currentBoss = null;
        this.bossHealth = 0;
        this.maxBossHealth = 0;
        this.bossPhase = 'normal';
        this.bossEffects = [];
        
        // Check achievements
        this.game.systems.achievements.checkBossAchievements();
        
        this.updateBossDisplay();
    }
    
    showBossDetails(bossId) {
        const boss = this.bosses[bossId];
        if (!boss) return;
        
        const isUnlocked = this.game.gameState.unlockedBosses?.includes(bossId) || false;
        const isDefeated = this.game.gameState.defeatedBosses?.includes(bossId) || false;
        
        const modalData = {
            title: `${boss.emoji} ${boss.name}`,
            content: `
                <div class="boss-details">
                    <div class="boss-info">
                        <p class="boss-description">${boss.description}</p>
                        <div class="boss-stats">
                            <div>❤️ Health: ${this.game.formatNumber(boss.health)}</div>
                            <div>⚔️ Damage: ${boss.damage}</div>
                            <div>📊 Level: ${boss.level}</div>
                        </div>
                        <div class="boss-abilities">
                            <h4>Abilities:</h4>
                            <ul>
                                ${boss.abilities.map(ability => `<li>${this.getAbilityDescription(ability)}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="boss-rewards">
                            <h4>Rewards:</h4>
                            <div>💰 ${this.game.formatNumber(boss.rewards.coins)} coins</div>
                            <div>⭐ ${boss.rewards.xp} XP</div>
                            <div>💎 ${boss.rewards.diamonds} diamonds</div>
                        </div>
                    </div>
                    <div class="boss-status">
                        ${isDefeated ? '✅ Defeated' : isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
                    </div>
                </div>
            `,
            buttons: isUnlocked && !isDefeated ? ['Fight Boss', 'Close'] : ['Close']
        };
        
        this.game.systems.modals.show(modalData, (button) => {
            if (button === 'Fight Boss') {
                this.startBossFight(bossId);
            }
        });
    }
    
    getAbilityDescription(ability) {
        const descriptions = {
            'sword_slash': 'Slashes with a rusty sword',
            'goblin_rage': 'Enters a rage state, increasing damage',
            'ice_slam': 'Slams the ground, creating ice spikes',
            'frost_nova': 'Releases a burst of freezing energy',
            'frozen_ground': 'Freezes the ground, slowing movement',
            'fire_breath': 'Breathes a cone of fire',
            'wing_buffet': 'Beats wings, creating strong winds',
            'dragon_roar': 'Lets out a terrifying roar',
            'magic_barrier': 'Creates a protective magic shield'
        };
        
        return descriptions[ability] || ability;
    }
    
    updateBossDisplay() {
        // Update current boss display
        const currentBossContainer = document.getElementById('currentBoss');
        if (currentBossContainer) {
            if (this.currentBoss) {
                const healthPercent = (this.bossHealth / this.maxBossHealth) * 100;
                const phaseColor = this.bossPhase === 'berserk' ? '#ff0000' : 
                                 this.bossPhase === 'enraged' ? '#ff8800' : '#00ff00';
                
                currentBossContainer.innerHTML = `
                    <div class="current-boss-info">
                        <h3>${this.currentBoss.emoji} ${this.currentBoss.name}</h3>
                        <div class="boss-health-bar">
                            <div class="health-fill" style="width: ${healthPercent}%; background-color: ${phaseColor}"></div>
                            <span class="health-text">${this.game.formatNumber(this.bossHealth)} / ${this.game.formatNumber(this.maxBossHealth)}</span>
                        </div>
                        <div class="boss-phase">Phase: ${this.bossPhase.toUpperCase()}</div>
                        <button class="boss-attack-btn">⚔️ Attack Boss</button>
                    </div>
                `;
            } else {
                currentBossContainer.innerHTML = `
                    <div class="no-boss">
                        <h3>👹 No Active Boss</h3>
                        <p>Select a boss from the list below to start a fight!</p>
                    </div>
                `;
            }
        }
        
        // Update boss list
        const bossListContainer = document.getElementById('bossList');
        if (bossListContainer) {
            let html = '<div class="boss-list-grid">';
            
            for (const [bossId, boss] of Object.entries(this.bosses)) {
                const isUnlocked = this.game.gameState.unlockedBosses?.includes(bossId) || false;
                const isDefeated = this.game.gameState.defeatedBosses?.includes(bossId) || false;
                const canFight = isUnlocked && !isDefeated;
                
                html += `
                    <div class="boss-item ${isUnlocked ? 'unlocked' : 'locked'} ${isDefeated ? 'defeated' : ''}" 
                         data-boss="${bossId}">
                        <div class="boss-icon">${boss.emoji}</div>
                        <div class="boss-info">
                            <div class="boss-name">${boss.name}</div>
                            <div class="boss-level">Level ${boss.level}</div>
                            <div class="boss-status">
                                ${isDefeated ? '✅ Defeated' : isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
                            </div>
                        </div>
                        ${canFight ? '<button class="boss-fight-btn">⚔️ Fight</button>' : ''}
                    </div>
                `;
            }
            
            html += '</div>';
            bossListContainer.innerHTML = html;
        }
    }
    
    update(deltaTime) {
        if (!this.currentBoss) return;
        
        // Update boss attack timer
        this.bossAttackTimer += deltaTime;
        if (this.bossAttackTimer >= this.bossAttackInterval) {
            this.bossAttack();
            this.bossAttackTimer = 0;
        }
        
        // Update boss effects
        for (let i = this.bossEffects.length - 1; i >= 0; i--) {
            const effect = this.bossEffects[i];
            effect.life -= deltaTime;
            
            if (effect.life <= 0) {
                this.bossEffects.splice(i, 1);
            }
        }
    }
    
    reset() {
        this.currentBoss = null;
        this.bossHealth = 0;
        this.maxBossHealth = 0;
        this.bossPhase = 'normal';
        this.bossEffects = [];
        
        if (this.game.gameState.unlockedBosses) {
            this.game.gameState.unlockedBosses = [];
        }
        if (this.game.gameState.defeatedBosses) {
            this.game.gameState.defeatedBosses = [];
        }
        
        this.updateBossDisplay();
    }
}