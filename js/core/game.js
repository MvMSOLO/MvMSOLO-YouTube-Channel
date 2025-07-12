// Epic Clicker Tycoon RPG - Main Game Core

class EpicClickerGame {
    constructor() {
        this.gameState = {
            // Player Stats
            level: 1,
            xp: 0,
            xpToNext: 100,
            totalClicks: 0,
            clickPower: 1,
            clicksPerSecond: 0,
            
            // Currency
            coins: 0,
            diamonds: 0,
            score: 0,
            
            // Multipliers
            coinMultiplier: 1,
            diamondMultiplier: 1,
            scoreMultiplier: 1,
            
            // Upgrades
            upgrades: {},
            autoclickers: {},
            
            // Skins
            currentSkin: 'baby_dragon',
            unlockedSkins: ['baby_dragon'],
            
            // Achievements
            achievements: {},
            achievementProgress: {},
            
            // Bosses
            currentBoss: null,
            defeatedBosses: [],
            
            // Minigames
            minigamesPlayed: 0,
            minigameScores: {},
            
            // Prestige
            prestigeCount: 0,
            prestigeMultiplier: 1,
            
            // Daily
            lastDailyClaim: null,
            dailyStreak: 0,
            
            // Settings
            settings: {
                musicVolume: 50,
                sfxVolume: 75,
                theme: 'light',
                particleEffects: true
            },
            
            // Statistics
            stats: {
                totalPlayTime: 0,
                totalCoinsEarned: 0,
                totalDiamondsEarned: 0,
                totalScoreEarned: 0,
                totalUpgradesPurchased: 0,
                totalSkinsUnlocked: 0,
                totalBossesDefeated: 0,
                totalMinigamesPlayed: 0,
                totalPrestiges: 0,
                fastestClick: 0,
                longestSession: 0,
                mostCoinsInSession: 0
            },
            
            // Timestamps
            lastSave: Date.now(),
            gameStartTime: Date.now(),
            sessionStartTime: Date.now()
        };
        
        this.gameLoop = null;
        this.autosaveInterval = null;
        this.offlineInterval = null;
        this.lastUpdate = Date.now();
        
        this.systems = {};
        this.isInitialized = false;
        this.isLoading = true;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.startGameLoop = this.startGameLoop.bind(this);
        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
        this.reset = this.reset.bind(this);
    }
    
    async init() {
        try {
            console.log('🎮 Initializing Epic Clicker Tycoon RPG...');
            
            // Load saved game data
            await this.load();
            
            // Initialize all game systems
            await this.initializeSystems();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start game loop
            this.startGameLoop();
            
            // Set up autosave
            this.setupAutosave();
            
            // Set up offline earnings
            this.setupOfflineEarnings();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            this.isLoading = false;
            
            console.log('✅ Epic Clicker Tycoon RPG initialized successfully!');
            
            // Show welcome notification
            this.showNotification('🎉 Welcome to Epic Clicker Tycoon RPG!', 'success');
            
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.showNotification('❌ Failed to initialize game. Please refresh the page.', 'error');
        }
    }
    
    async initializeSystems() {
        // Initialize core systems
        this.systems.save = new SaveSystem(this);
        this.systems.audio = new AudioSystem(this);
        this.systems.particles = new ParticleSystem(this);
        
        // Initialize game systems
        this.systems.clicking = new ClickingSystem(this);
        this.systems.shop = new ShopSystem(this);
        this.systems.upgrades = new UpgradeSystem(this);
        this.systems.inventory = new InventorySystem(this);
        this.systems.achievements = new AchievementSystem(this);
        this.systems.bosses = new BossSystem(this);
        this.systems.minigames = new MinigameSystem(this);
        this.systems.leaderboard = new LeaderboardSystem(this);
        this.systems.chat = new ChatSystem(this);
        this.systems.daily = new DailySystem(this);
        this.systems.prestige = new PrestigeSystem(this);
        
        // Initialize UI systems
        this.systems.modals = new ModalSystem(this);
        this.systems.notifications = new NotificationSystem(this);
        this.systems.animations = new AnimationSystem(this);
        
        // Initialize utility systems
        this.systems.helpers = new HelperSystem(this);
        this.systems.random = new RandomSystem(this);
        this.systems.effects = new EffectSystem(this);
        
        // Initialize all systems
        for (const [name, system] of Object.entries(this.systems)) {
            if (system.init) {
                await system.init();
            }
        }
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
        
        // Settings
        document.getElementById('musicVolume').addEventListener('input', (e) => {
            this.gameState.settings.musicVolume = parseInt(e.target.value);
            this.systems.audio.setMusicVolume(this.gameState.settings.musicVolume);
        });
        
        document.getElementById('sfxVolume').addEventListener('input', (e) => {
            this.gameState.settings.sfxVolume = parseInt(e.target.value);
            this.systems.audio.setSfxVolume(this.gameState.settings.sfxVolume);
        });
        
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.gameState.settings.theme = e.target.value;
            this.applyTheme(this.gameState.settings.theme);
        });
        
        document.getElementById('particleEffects').addEventListener('change', (e) => {
            this.gameState.settings.particleEffects = e.target.checked;
        });
        
        // Save data
        document.getElementById('exportSaveBtn').addEventListener('click', () => {
            this.exportSave();
        });
        
        document.getElementById('importSaveBtn').addEventListener('click', () => {
            this.importSave();
        });
        
        document.getElementById('resetSaveBtn').addEventListener('click', () => {
            this.confirmReset();
        });
        
        // Developer console
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggleDevConsole();
            }
        });
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.save();
        });
        
        window.addEventListener('focus', () => {
            this.onWindowFocus();
        });
        
        window.addEventListener('blur', () => {
            this.onWindowBlur();
        });
    }
    
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, 1000 / 60); // 60 FPS
    }
    
    update() {
        if (!this.isInitialized) return;
        
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        // Update game state
        this.gameState.stats.totalPlayTime += deltaTime;
        
        // Update all systems
        for (const [name, system] of Object.entries(this.systems)) {
            if (system.update) {
                system.update(deltaTime);
            }
        }
        
        // Update UI
        this.updateUI();
        
        // Check for achievements
        this.systems.achievements.checkAchievements();
        
        // Check for level up
        this.checkLevelUp();
    }
    
    updateUI() {
        // Update currency displays
        document.getElementById('coinsDisplay').textContent = this.formatNumber(this.gameState.coins);
        document.getElementById('diamondsDisplay').textContent = this.formatNumber(this.gameState.diamonds);
        document.getElementById('scoreDisplay').textContent = this.formatNumber(this.gameState.score);
        
        // Update level and XP
        document.getElementById('playerLevel').textContent = this.gameState.level;
        document.getElementById('xpText').textContent = `${this.gameState.xp} / ${this.gameState.xpToNext} XP`;
        
        const xpPercentage = (this.gameState.xp / this.gameState.xpToNext) * 100;
        document.getElementById('xpFill').style.width = `${xpPercentage}%`;
        
        // Update clicking stats
        document.getElementById('clickPower').textContent = this.formatNumber(this.gameState.clickPower);
        document.getElementById('cpsDisplay').textContent = this.formatNumber(this.gameState.clicksPerSecond);
        document.getElementById('totalClicks').textContent = this.formatNumber(this.gameState.totalClicks);
        
        // Update current skin
        const currentSkin = this.getCurrentSkin();
        if (currentSkin) {
            document.getElementById('objectSprite').textContent = currentSkin.emoji;
            document.getElementById('objectName').textContent = currentSkin.name;
            document.getElementById('objectLevel').textContent = `Level ${this.gameState.level}`;
        }
    }
    
    checkLevelUp() {
        if (this.gameState.xp >= this.gameState.xpToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.gameState.level++;
        this.gameState.xp -= this.gameState.xpToNext;
        this.gameState.xpToNext = Math.floor(this.gameState.xpToNext * 1.2);
        
        // Level up rewards
        this.gameState.coins += this.gameState.level * 10;
        this.gameState.diamonds += Math.floor(this.gameState.level / 10);
        
        // Play level up sound
        this.systems.audio.playSound('levelUp');
        
        // Show level up notification
        this.showNotification(`🎉 Level Up! You are now level ${this.gameState.level}!`, 'success');
        
        // Check for new unlocks
        this.checkUnlocks();
    }
    
    checkUnlocks() {
        // Check for new boss unlocks
        this.systems.bosses.checkUnlocks();
        
        // Check for new minigame unlocks
        this.systems.minigames.checkUnlocks();
        
        // Check for new skin unlocks
        this.systems.shop.checkSkinUnlocks();
    }
    
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.game-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = document.getElementById(`${tabName}Tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Add active class to nav tab
        const navTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (navTab) {
            navTab.classList.add('active');
        }
        
        // Update tab-specific content
        this.updateTabContent(tabName);
    }
    
    updateTabContent(tabName) {
        switch (tabName) {
            case 'shop':
                this.systems.shop.updateShopDisplay();
                break;
            case 'upgrades':
                this.systems.upgrades.updateUpgradeTree();
                break;
            case 'inventory':
                this.systems.inventory.updateInventoryDisplay();
                break;
            case 'achievements':
                this.systems.achievements.updateAchievementsDisplay();
                break;
            case 'bosses':
                this.systems.bosses.updateBossDisplay();
                break;
            case 'minigames':
                this.systems.minigames.updateMinigameDisplay();
                break;
            case 'leaderboard':
                this.systems.leaderboard.updateLeaderboard();
                break;
        }
    }
    
    getCurrentSkin() {
        return this.systems.shop.getSkinById(this.gameState.currentSkin);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('epicClickerTheme', theme);
    }
    
    setupAutosave() {
        this.autosaveInterval = setInterval(() => {
            this.save();
        }, 30000); // Save every 30 seconds
    }
    
    setupOfflineEarnings() {
        this.offlineInterval = setInterval(() => {
            this.calculateOfflineEarnings();
        }, 60000); // Check every minute
    }
    
    calculateOfflineEarnings() {
        const now = Date.now();
        const timeDiff = now - this.gameState.lastSave;
        const hoursOffline = timeDiff / (1000 * 60 * 60);
        
        if (hoursOffline >= 0.1) { // At least 6 minutes
            const offlineCoins = Math.floor(this.gameState.clicksPerSecond * hoursOffline * 3600 * 0.1);
            const offlineDiamonds = Math.floor(offlineCoins / 10000);
            
            if (offlineCoins > 0) {
                this.gameState.coins += offlineCoins;
                this.gameState.diamonds += offlineDiamonds;
                
                this.showNotification(`💰 Offline earnings: ${this.formatNumber(offlineCoins)} coins, ${offlineDiamonds} diamonds`, 'info');
            }
        }
    }
    
    onWindowFocus() {
        // Calculate offline earnings when window gains focus
        this.calculateOfflineEarnings();
    }
    
    onWindowBlur() {
        // Save game when window loses focus
        this.save();
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const gameContainer = document.getElementById('gameContainer');
        
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            gameContainer.classList.remove('hidden');
        }, 500);
    }
    
    showNotification(message, type = 'info') {
        this.systems.notifications.show(message, type);
    }
    
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return Math.floor(num).toString();
    }
    
    toggleDevConsole() {
        const console = document.getElementById('devConsole');
        console.classList.toggle('active');
    }
    
    confirmReset() {
        this.systems.modals.show({
            title: 'Reset Game',
            content: 'Are you sure you want to reset your game? This action cannot be undone!',
            buttons: [
                { text: 'Cancel', type: 'secondary' },
                { text: 'Reset', type: 'danger', action: () => this.reset() }
            ]
        });
    }
    
    reset() {
        // Clear all game data
        localStorage.removeItem('epicClickerSave');
        localStorage.removeItem('epicClickerTheme');
        
        // Reload page
        window.location.reload();
    }
    
    exportSave() {
        const saveData = JSON.stringify(this.gameState);
        const blob = new Blob([saveData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `epic-clicker-save-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('💾 Save data exported successfully!', 'success');
    }
    
    importSave() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const saveData = JSON.parse(e.target.result);
                        this.gameState = { ...this.gameState, ...saveData };
                        this.save();
                        this.showNotification('💾 Save data imported successfully!', 'success');
                        window.location.reload();
                    } catch (error) {
                        this.showNotification('❌ Invalid save file!', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    async save() {
        this.gameState.lastSave = Date.now();
        await this.systems.save.saveGame(this.gameState);
    }
    
    async load() {
        const savedData = await this.systems.save.loadGame();
        if (savedData) {
            this.gameState = { ...this.gameState, ...savedData };
        }
    }
}

// Export the class for use in main.js
window.EpicClickerGame = EpicClickerGame;