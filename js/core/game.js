// Core Game Module
class EpicClickerGame {
    constructor() {
        this.state = {
            coins: 0,
            diamonds: 0,
            score: 0,
            clickPower: 1,
            totalClicks: 0,
            clicksPerSecond: 0,
            level: 1,
            experience: 0,
            experienceToNext: 100,
            upgrades: {},
            autoClickers: {},
            multipliers: { click: 1, global: 1 },
            ownedSkins: ['dragon_basic'],
            equippedSkin: 'dragon_basic',
            currentBoss: null,
            bossHealth: 0,
            bossMaxHealth: 0,
            prestigeLevel: 0,
            prestigeMultiplier: 1,
            lastDailyReward: 0,
            dailyStreak: 0,
            achievements: [],
            settings: { sound: true, particles: true, music: true },
            stats: { 
                totalCoinsEarned: 0, 
                totalDiamondsEarned: 0, 
                totalBossesDefeated: 0, 
                totalPrestiges: 0, 
                playTime: 0,
                totalDamageDealt: 0,
                criticalHits: 0,
                luckyClicks: 0
            },
            inventory: {
                skins: [],
                items: [],
                chests: []
            },
            events: {
                activeEvents: [],
                eventHistory: []
            }
        };
        
        this.gameLoop = null;
        this.autoClickerInterval = null;
        this.saveInterval = null;
        this.statsInterval = null;
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.updateUI();
        this.startGameLoop();
        this.showNotification('Welcome to Epic Clicker Tycoon RPG!', 'success');
        
        // Initialize systems
        this.initSystems();
    }

    initSystems() {
        // Initialize all game systems
        if (window.CurrencySystem) window.CurrencySystem.init(this);
        if (window.UpgradeSystem) window.UpgradeSystem.init(this);
        if (window.SkinSystem) window.SkinSystem.init(this);
        if (window.BossSystem) window.BossSystem.init(this);
        if (window.AchievementSystem) window.AchievementSystem.init(this);
        if (window.DailySystem) window.DailySystem.init(this);
        if (window.PrestigeSystem) window.PrestigeSystem.init(this);
        if (window.InventorySystem) window.InventorySystem.init(this);
        if (window.AudioSystem) window.AudioSystem.init(this);
        if (window.ParticleSystem) window.ParticleSystem.init(this);
    }

    handleClick() {
        const damage = this.calculateClickDamage();
        this.state.coins += damage;
        this.state.score += damage;
        this.state.totalClicks++;
        this.state.experience += 1;
        this.state.stats.totalCoinsEarned += damage;
        this.state.stats.totalDamageDealt += damage;
        
        // Check for critical hits
        if (Math.random() < 0.1) {
            this.state.stats.criticalHits++;
        }
        
        // Check for lucky clicks
        if (Math.random() < 0.01) {
            this.state.stats.luckyClicks++;
            this.state.coins += damage * 10;
            this.showNotification('Lucky Click! 10x bonus!', 'success');
        }
        
        this.checkLevelUp();
        this.checkAchievements();
        
        if (this.state.currentBoss) {
            this.damageBoss(damage);
        }
        
        this.createDamageText(damage);
        this.createParticles();
        this.playClickSound();
        
        this.updateUI();
        this.saveGame();
    }

    calculateClickDamage() {
        let damage = this.state.clickPower;
        damage *= this.state.multipliers.click;
        damage *= this.state.multipliers.global;
        damage *= this.state.prestigeMultiplier;
        
        // Critical hit chance
        if (Math.random() < 0.1) {
            damage *= 2;
        }
        
        return Math.floor(damage);
    }

    autoClick() {
        if (this.state.currentBoss) {
            const damage = this.calculateClickDamage() * 0.5;
            this.damageBoss(damage);
        } else {
            const coins = this.calculateClickDamage() * 0.5;
            this.state.coins += coins;
            this.state.score += coins;
            this.state.stats.totalCoinsEarned += coins;
        }
        this.updateUI();
    }

    damageBoss(damage) {
        this.state.bossHealth -= damage;
        if (this.state.bossHealth <= 0) {
            this.defeatBoss();
        }
        this.updateBossUI();
    }

    defeatBoss() {
        const boss = this.state.currentBoss;
        const reward = boss.reward;
        this.state.coins += reward;
        this.state.score += reward;
        this.state.stats.totalBossesDefeated++;
        this.state.currentBoss = null;
        this.state.bossHealth = 0;
        this.showNotification(`Defeated ${boss.name}! +${reward} coins`, 'success');
        this.updateUI();
    }

    checkLevelUp() {
        if (this.state.experience >= this.state.experienceToNext) {
            this.state.level++;
            this.state.experience -= this.state.experienceToNext;
            this.state.experienceToNext = Math.floor(this.state.experienceToNext * 1.2);
            
            // Level up rewards
            this.state.coins += this.state.level * 10;
            this.state.diamonds += Math.floor(this.state.level / 10);
            
            this.showNotification(`Level Up! You are now level ${this.state.level}!`, 'success');
            this.updateUI();
        }
    }

    checkAchievements() {
        if (window.AchievementSystem) {
            window.AchievementSystem.checkAchievements(this.state);
        }
    }

    prestige() {
        if (this.state.score < 1000000) {
            this.showNotification('You need 1,000,000 score to prestige!', 'warning');
            return;
        }
        
        const prestigeBonus = Math.floor(this.state.score / 1000000);
        
        // Reset game state
        this.state.coins = 0;
        this.state.score = 0;
        this.state.clickPower = 1;
        this.state.upgrades = {};
        this.state.autoClickers = {};
        this.state.multipliers = { click: 1, global: 1 };
        this.state.level = 1;
        this.state.experience = 0;
        this.state.experienceToNext = 100;
        this.state.currentBoss = null;
        this.state.bossHealth = 0;
        
        // Apply prestige bonus
        this.state.prestigeLevel++;
        this.state.prestigeMultiplier += prestigeBonus * 0.1;
        this.state.stats.totalPrestiges++;
        
        this.showNotification(`Prestige! +${prestigeBonus * 10}% permanent bonus!`, 'success');
        this.updateUI();
        this.saveGame();
    }

    updateUI() {
        // Update currency displays
        document.getElementById('coinsDisplay').textContent = this.formatNumber(this.state.coins);
        document.getElementById('diamondsDisplay').textContent = this.formatNumber(this.state.diamonds);
        document.getElementById('scoreDisplay').textContent = this.formatNumber(this.state.score);
        
        // Update stats
        document.getElementById('clickPower').textContent = this.formatNumber(this.state.clickPower);
        document.getElementById('clicksPerSecond').textContent = this.formatNumber(this.state.clicksPerSecond);
        document.getElementById('totalClicks').textContent = this.formatNumber(this.state.totalClicks);
        
        // Update level
        document.getElementById('levelDisplay').textContent = `Level ${this.state.level}`;
        const levelProgress = (this.state.experience / this.state.experienceToNext) * 100;
        document.getElementById('levelProgress').style.width = `${levelProgress}%`;
        
        // Update prestige
        document.getElementById('prestigeLevel').textContent = this.state.prestigeLevel;
        document.getElementById('prestigeMultiplier').textContent = `${this.state.prestigeMultiplier.toFixed(1)}x`;
        
        // Update prestige button
        const prestigeBtn = document.getElementById('prestigeBtn');
        if (this.state.score >= 1000000) {
            prestigeBtn.disabled = false;
            prestigeBtn.textContent = 'Prestige!';
        } else {
            prestigeBtn.disabled = true;
            prestigeBtn.textContent = `Prestige (Requires ${this.formatNumber(1000000)} Score)`;
        }
        
        // Update other UI components
        this.updateSkinDisplay();
        this.updateShop();
        this.updateBossUI();
    }

    updateSkinDisplay() {
        const skin = window.SKINS_CONFIG?.skins?.[this.state.equippedSkin] || 
                   { emoji: '🐉', name: 'Basic Dragon' };
        document.getElementById('objectImage').textContent = skin.emoji;
    }

    updateShop() {
        const shopItems = document.getElementById('shopItems');
        if (!shopItems) return;
        
        shopItems.innerHTML = '';
        
        const upgrades = window.UPGRADES_CONFIG?.shopItems || {};
        Object.entries(upgrades).forEach(([id, upgrade]) => {
            const currentLevel = this.state.upgrades[id] || 0;
            const cost = upgrade.cost * (currentLevel + 1);
            const canAfford = this.state.coins >= cost;
            const maxed = currentLevel >= upgrade.maxLevel;
            
            const item = document.createElement('div');
            item.className = `shop-item ${maxed ? 'owned' : ''} ${!canAfford && !maxed ? 'unavailable' : ''}`;
            item.innerHTML = `
                <div class="shop-item-header">
                    <span class="shop-item-icon">⚡</span>
                    <span class="shop-item-name">${upgrade.name}</span>
                </div>
                <div class="shop-item-description">Level ${currentLevel}/${upgrade.maxLevel}</div>
                <div class="shop-item-cost ${!canAfford && !maxed ? 'insufficient' : ''}">
                    <i class="fas fa-coins"></i>
                    <span>${this.formatNumber(cost)}</span>
                </div>
            `;
            
            if (!maxed && canAfford) {
                item.addEventListener('click', () => this.buyUpgrade(id));
            }
            
            shopItems.appendChild(item);
        });
    }

    updateBossUI() {
        const bossHealth = document.getElementById('bossHealth');
        const bossImage = document.getElementById('bossImage');
        const bossName = document.getElementById('bossName');
        
        if (this.state.currentBoss) {
            const healthPercent = (this.state.bossHealth / this.state.bossMaxHealth) * 100;
            bossHealth.style.width = `${healthPercent}%`;
            bossImage.textContent = this.state.currentBoss.emoji;
            bossName.textContent = this.state.currentBoss.name;
        } else {
            bossHealth.style.width = '0%';
            bossImage.textContent = '👹';
            bossName.textContent = 'No Boss Active';
        }
        
        const bossList = document.getElementById('bossList');
        if (!bossList) return;
        
        bossList.innerHTML = '';
        
        const bosses = window.BOSSES_CONFIG?.bosses || [];
        bosses.forEach(boss => {
            const item = document.createElement('div');
            item.className = 'boss-item';
            item.innerHTML = `
                <span class="boss-item-icon">${boss.emoji}</span>
                <div class="boss-item-info">
                    <div class="boss-item-name">${boss.name}</div>
                    <div class="boss-item-level">HP: ${this.formatNumber(boss.health)}</div>
                </div>
            `;
            
            item.addEventListener('click', () => this.startBossFight(boss));
            bossList.appendChild(item);
        });
    }

    startBossFight(boss) {
        this.state.currentBoss = boss;
        this.state.bossHealth = boss.health;
        this.state.bossMaxHealth = boss.health;
        this.showNotification(`Boss fight started: ${boss.name}!`, 'success');
        this.updateBossUI();
    }

    buyUpgrade(upgradeId) {
        const upgrades = window.UPGRADES_CONFIG?.shopItems || {};
        const upgrade = upgrades[upgradeId];
        if (!upgrade) return;
        
        const currentLevel = this.state.upgrades[upgradeId] || 0;
        
        if (currentLevel >= upgrade.maxLevel) {
            this.showNotification('Upgrade already at max level!', 'warning');
            return;
        }
        
        const cost = upgrade.cost * (currentLevel + 1);
        
        if (this.state.coins >= cost) {
            this.state.coins -= cost;
            this.state.upgrades[upgradeId] = (this.state.upgrades[upgradeId] || 0) + 1;
            this.applyUpgradeEffect(upgradeId);
            this.showNotification(`Upgraded ${upgrade.name}!`, 'success');
            this.updateUI();
            this.saveGame();
        } else {
            this.showNotification('Not enough coins!', 'error');
        }
    }

    applyUpgradeEffect(upgradeId) {
        const upgrades = window.UPGRADES_CONFIG?.shopItems || {};
        const upgrade = upgrades[upgradeId];
        if (!upgrade) return;
        
        const level = this.state.upgrades[upgradeId];
        
        switch (upgradeId) {
            case 'clickUpgrade1':
            case 'clickUpgrade2':
                this.state.clickPower += upgrade.effect;
                break;
            case 'autoClicker1':
            case 'autoClicker2':
                this.state.clicksPerSecond += upgrade.effect;
                break;
            case 'multiplier1':
                this.state.multipliers.click *= upgrade.effect;
                break;
        }
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return Math.floor(num).toString();
    }

    createDamageText(damage) {
        const damageText = document.getElementById('damageText');
        if (!damageText) return;
        
        damageText.textContent = `+${this.formatNumber(damage)}`;
        damageText.style.animation = 'none';
        damageText.offsetHeight;
        damageText.style.animation = 'damageFloat 1s ease-out forwards';
    }

    createParticles() {
        if (!this.state.settings.particles) return;
        
        const particles = document.getElementById('particles');
        if (!particles) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particles.appendChild(particle);
        
        setTimeout(() => particle.remove(), 6000);
    }

    playClickSound() {
        if (!this.state.settings.sound) return;
        
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.1;
        audio.play().catch(() => {});
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${type.toUpperCase()}</span>
                <button class="notification-close">×</button>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    setupEventListeners() {
        const clickableObject = document.getElementById('clickableObject');
        if (clickableObject) {
            clickableObject.addEventListener('click', () => this.handleClick());
        }
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        const prestigeBtn = document.getElementById('prestigeBtn');
        if (prestigeBtn) {
            prestigeBtn.addEventListener('click', () => this.prestige());
        }
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.switchShopCategory(category);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const activePanel = document.getElementById(`${tabName}Tab`);
        if (activePanel) activePanel.classList.add('active');
    }

    switchShopCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        this.updateShop();
    }

    saveGame() {
        localStorage.setItem('epicClickerSave', JSON.stringify(this.state));
    }

    loadGame() {
        const save = localStorage.getItem('epicClickerSave');
        if (save) {
            const loadedState = JSON.parse(save);
            this.state = { ...this.state, ...loadedState };
        }
    }

    startGameLoop() {
        // Auto clicker loop
        this.autoClickerInterval = setInterval(() => {
            if (this.state.clicksPerSecond > 0) {
                this.autoClick();
            }
        }, 1000);
        
        // Save game every 30 seconds
        this.saveInterval = setInterval(() => {
            this.saveGame();
        }, 30000);
        
        // Update play time
        this.statsInterval = setInterval(() => {
            this.state.stats.playTime++;
        }, 1000);
    }

    destroy() {
        if (this.autoClickerInterval) clearInterval(this.autoClickerInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        if (this.statsInterval) clearInterval(this.statsInterval);
    }
}

// Global game instance
window.EpicClickerGame = EpicClickerGame;