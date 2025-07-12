// Epic Clicker Tycoon RPG - Achievement System

class AchievementSystem {
    constructor(game) {
        this.game = game;
        this.achievements = {};
        this.recentlyUnlocked = [];
        this.achievementNotifications = [];
    }
    
    async init() {
        console.log('🏆 Achievement system initialized');
        await this.loadAchievements();
        this.setupEventListeners();
        this.checkInitialAchievements();
    }
    
    async loadAchievements() {
        try {
            const response = await fetch('config/achievements.json');
            const data = await response.json();
            this.achievements = data.achievements;
            console.log('🏆 Achievements loaded successfully');
        } catch (error) {
            console.warn('Failed to load achievements config, using defaults');
            this.createDefaultAchievements();
        }
    }
    
    createDefaultAchievements() {
        this.achievements = {
            "clicking": [
                {
                    "id": "first_click",
                    "name": "First Click",
                    "description": "Click for the first time",
                    "icon": "👆",
                    "requirement": {"type": "clicks", "value": 1},
                    "reward": {"coins": 10, "xp": 5},
                    "rarity": "common"
                },
                {
                    "id": "click_100",
                    "name": "Century Clicker",
                    "description": "Click 100 times",
                    "icon": "💯",
                    "requirement": {"type": "clicks", "value": 100},
                    "reward": {"coins": 50, "xp": 25},
                    "rarity": "common"
                }
            ],
            "coins": [
                {
                    "id": "first_coin",
                    "name": "First Coin",
                    "description": "Earn your first coin",
                    "icon": "🪙",
                    "requirement": {"type": "coins", "value": 1},
                    "reward": {"coins": 5, "xp": 10},
                    "rarity": "common"
                }
            ],
            "level": [
                {
                    "id": "level_10",
                    "name": "Level 10",
                    "description": "Reach level 10",
                    "icon": "🔟",
                    "requirement": {"type": "level", "value": 10},
                    "reward": {"coins": 500, "xp": 100},
                    "rarity": "common"
                }
            ]
        };
    }
    
    setupEventListeners() {
        // Achievement display updates
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('achievement-item')) {
                const achievementId = e.target.dataset.achievement;
                this.showAchievementDetails(achievementId);
            }
        });
    }
    
    checkInitialAchievements() {
        // Check for achievements that should be unlocked on game start
        this.checkClickingAchievements();
        this.checkCoinAchievements();
        this.checkLevelAchievements();
        this.checkSkinAchievements();
        this.checkUpgradeAchievements();
    }
    
    checkClickingAchievements() {
        const totalClicks = this.game.gameState.totalClicks;
        const achievements = this.achievements.clicking || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'clicks' && 
                totalClicks >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkCoinAchievements() {
        const totalCoins = this.game.gameState.stats.totalCoinsEarned;
        const achievements = this.achievements.coins || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'coins' && 
                totalCoins >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkLevelAchievements() {
        const level = this.game.gameState.level;
        const achievements = this.achievements.level || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'level' && 
                level >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkSkinAchievements() {
        const unlockedSkins = this.game.gameState.unlockedSkins.length;
        const achievements = this.achievements.skins || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'skins' && 
                unlockedSkins >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkUpgradeAchievements() {
        const totalUpgrades = this.getTotalUpgradeLevel();
        const achievements = this.achievements.upgrades || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'upgrades' && 
                totalUpgrades >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkSpeedClicking() {
        const achievements = this.achievements.speed_clicking || [];
        const fastestClick = this.game.systems.clicking.fastestClick;
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'fastest_click' && 
                fastestClick <= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkLuckyStreak() {
        const luckyStreak = this.game.systems.clicking.luckyStreak;
        const achievements = this.achievements.lucky_streak || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'lucky_streak' && 
                luckyStreak >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkCriticalStreak() {
        const criticalStreak = this.game.systems.clicking.criticalStreak;
        const achievements = this.achievements.critical_streak || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'critical_streak' && 
                criticalStreak >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkBossAchievements() {
        const defeatedBosses = this.game.gameState.defeatedBosses.length;
        const achievements = this.achievements.bosses || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'bosses' && 
                defeatedBosses >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkMinigameAchievements() {
        const minigamesPlayed = this.game.gameState.minigamesPlayed;
        const achievements = this.achievements.minigames || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'minigames' && 
                minigamesPlayed >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    checkPrestigeAchievements() {
        const prestigeCount = this.game.gameState.prestigeCount;
        const achievements = this.achievements.prestige || [];
        
        for (const achievement of achievements) {
            if (this.isAchievementUnlocked(achievement.id)) continue;
            
            if (achievement.requirement.type === 'prestige' && 
                prestigeCount >= achievement.requirement.value) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    unlockAchievement(achievement) {
        if (this.isAchievementUnlocked(achievement.id)) return;
        
        // Mark as unlocked
        this.game.gameState.achievements[achievement.id] = {
            unlocked: true,
            unlockedAt: Date.now(),
            progress: this.getAchievementProgress(achievement)
        };
        
        // Add to recently unlocked
        this.recentlyUnlocked.unshift(achievement);
        if (this.recentlyUnlocked.length > 5) {
            this.recentlyUnlocked.pop();
        }
        
        // Apply rewards
        this.applyAchievementRewards(achievement);
        
        // Show notification
        this.showAchievementNotification(achievement);
        
        // Create particle effect
        this.game.systems.particles.createAchievementParticles();
        
        // Play sound
        this.game.systems.audio.playSound('achievement');
        
        // Update display
        this.updateAchievementsDisplay();
        
        console.log(`🏆 Achievement unlocked: ${achievement.name}!`);
    }
    
    isAchievementUnlocked(achievementId) {
        return this.game.gameState.achievements[achievementId]?.unlocked || false;
    }
    
    getAchievementProgress(achievement) {
        const req = achievement.requirement;
        
        switch (req.type) {
            case 'clicks':
                return this.game.gameState.totalClicks;
            case 'coins':
                return this.game.gameState.stats.totalCoinsEarned;
            case 'level':
                return this.game.gameState.level;
            case 'skins':
                return this.game.gameState.unlockedSkins.length;
            case 'upgrades':
                return this.getTotalUpgradeLevel();
            case 'bosses':
                return this.game.gameState.defeatedBosses.length;
            case 'minigames':
                return this.game.gameState.minigamesPlayed;
            case 'prestige':
                return this.game.gameState.prestigeCount;
            default:
                return 0;
        }
    }
    
    getTotalUpgradeLevel() {
        let total = 0;
        for (const level of Object.values(this.game.gameState.upgrades)) {
            total += level;
        }
        return total;
    }
    
    applyAchievementRewards(achievement) {
        if (achievement.reward) {
            if (achievement.reward.coins) {
                this.game.gameState.coins += achievement.reward.coins;
            }
            if (achievement.reward.diamonds) {
                this.game.gameState.diamonds += achievement.reward.diamonds;
            }
            if (achievement.reward.xp) {
                this.game.gameState.xp += achievement.reward.xp;
            }
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = {
            id: Date.now(),
            achievement: achievement,
            timestamp: Date.now()
        };
        
        this.achievementNotifications.push(notification);
        
        // Show in-game notification
        this.game.showNotification(
            `🏆 ${achievement.name} unlocked!`,
            'achievement'
        );
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            this.achievementNotifications = this.achievementNotifications.filter(
                n => n.id !== notification.id
            );
        }, 5000);
    }
    
    showAchievementDetails(achievementId) {
        const achievement = this.getAchievementById(achievementId);
        if (!achievement) return;
        
        const isUnlocked = this.isAchievementUnlocked(achievementId);
        const progress = this.getAchievementProgress(achievement);
        const requirement = achievement.requirement.value;
        const progressPercent = Math.min((progress / requirement) * 100, 100);
        
        const modalData = {
            title: `${achievement.icon} ${achievement.name}`,
            content: `
                <div class="achievement-details">
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <span class="progress-text">${progress} / ${requirement}</span>
                    </div>
                    <div class="achievement-rewards">
                        <h4>Rewards:</h4>
                        ${achievement.reward.coins ? `<div>💰 ${achievement.reward.coins} coins</div>` : ''}
                        ${achievement.reward.diamonds ? `<div>💎 ${achievement.reward.diamonds} diamonds</div>` : ''}
                        ${achievement.reward.xp ? `<div>⭐ ${achievement.reward.xp} XP</div>` : ''}
                    </div>
                    <div class="achievement-status ${isUnlocked ? 'unlocked' : 'locked'}">
                        ${isUnlocked ? '✅ Unlocked' : '🔒 Locked'}
                    </div>
                </div>
            `,
            buttons: ['Close']
        };
        
        this.game.systems.modals.show(modalData);
    }
    
    getAchievementById(achievementId) {
        for (const category in this.achievements) {
            const achievement = this.achievements[category].find(a => a.id === achievementId);
            if (achievement) return achievement;
        }
        return null;
    }
    
    getAllAchievements() {
        const allAchievements = [];
        for (const category in this.achievements) {
            allAchievements.push(...this.achievements[category]);
        }
        return allAchievements;
    }
    
    getUnlockedAchievements() {
        return this.getAllAchievements().filter(a => this.isAchievementUnlocked(a.id));
    }
    
    getLockedAchievements() {
        return this.getAllAchievements().filter(a => !this.isAchievementUnlocked(a.id));
    }
    
    getAchievementCount() {
        const all = this.getAllAchievements().length;
        const unlocked = this.getUnlockedAchievements().length;
        return { total: all, unlocked: unlocked, locked: all - unlocked };
    }
    
    updateAchievementsDisplay() {
        const container = document.getElementById('achievementsGrid');
        if (!container) return;
        
        const count = this.getAchievementCount();
        let html = `
            <div class="achievements-header">
                <h3>🏆 Achievements (${count.unlocked}/${count.total})</h3>
                <div class="achievement-progress-bar">
                    <div class="progress-fill" style="width: ${(count.unlocked / count.total) * 100}%"></div>
                </div>
            </div>
            <div class="achievements-grid">
        `;
        
        for (const category in this.achievements) {
            html += `<div class="achievement-category">
                <h4>${this.getCategoryName(category)}</h4>
                <div class="category-achievements">
            `;
            
            for (const achievement of this.achievements[category]) {
                const isUnlocked = this.isAchievementUnlocked(achievement.id);
                const progress = this.getAchievementProgress(achievement);
                const requirement = achievement.requirement.value;
                const progressPercent = Math.min((progress / requirement) * 100, 100);
                
                html += `
                    <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}" 
                         data-achievement="${achievement.id}">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                            <div class="achievement-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                                <span>${progress}/${requirement}</span>
                            </div>
                        </div>
                        <div class="achievement-status">
                            ${isUnlocked ? '✅' : '🔒'}
                        </div>
                    </div>
                `;
            }
            
            html += `</div></div>`;
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    getCategoryName(category) {
        const names = {
            'clicking': 'Clicking',
            'coins': 'Coins',
            'diamonds': 'Diamonds',
            'level': 'Level',
            'skins': 'Skins',
            'upgrades': 'Upgrades',
            'speed_clicking': 'Speed Clicking',
            'lucky_streak': 'Lucky Streaks',
            'critical_streak': 'Critical Streaks',
            'bosses': 'Bosses',
            'minigames': 'Minigames',
            'prestige': 'Prestige'
        };
        return names[category] || category;
    }
    
    update(deltaTime) {
        // Check for new achievements periodically
        this.checkClickingAchievements();
        this.checkCoinAchievements();
        this.checkLevelAchievements();
        this.checkSkinAchievements();
        this.checkUpgradeAchievements();
        this.checkSpeedClicking();
        this.checkLuckyStreak();
        this.checkCriticalStreak();
        this.checkBossAchievements();
        this.checkMinigameAchievements();
        this.checkPrestigeAchievements();
    }
    
    reset() {
        this.game.gameState.achievements = {};
        this.recentlyUnlocked = [];
        this.achievementNotifications = [];
        this.updateAchievementsDisplay();
    }
}