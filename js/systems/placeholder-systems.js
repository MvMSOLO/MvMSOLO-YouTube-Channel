// Epic Clicker Tycoon RPG - Remaining Placeholder Systems

// Leaderboard System
class LeaderboardSystem {
    constructor(game) {
        this.game = game;
        this.leaderboard = [];
        this.localScores = [];
    }
    
    async init() {
        console.log('📊 Leaderboard system initialized');
        this.loadLocalScores();
    }
    
    loadLocalScores() {
        const saved = localStorage.getItem('leaderboard_scores');
        if (saved) {
            this.localScores = JSON.parse(saved);
        }
    }
    
    saveLocalScores() {
        localStorage.setItem('leaderboard_scores', JSON.stringify(this.localScores));
    }
    
    addScore(score, playerName = 'Player') {
        const scoreEntry = {
            name: playerName,
            score: score,
            date: Date.now(),
            level: this.game.gameState.level,
            clicks: this.game.gameState.totalClicks
        };
        
        this.localScores.push(scoreEntry);
        this.localScores.sort((a, b) => b.score - a.score);
        
        if (this.localScores.length > 100) {
            this.localScores = this.localScores.slice(0, 100);
        }
        
        this.saveLocalScores();
        this.updateLeaderboard();
    }
    
    updateLeaderboard() {
        const container = document.getElementById('leaderboardList');
        if (!container) return;
        
        let html = '<div class="leaderboard-header"><h3>🏆 Top Scores</h3></div>';
        
        if (this.localScores.length === 0) {
            html += '<div class="empty-leaderboard">No scores yet! Start playing to set records!</div>';
        } else {
            html += '<div class="leaderboard-entries">';
            
            this.localScores.slice(0, 10).forEach((entry, index) => {
                const rank = index + 1;
                const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                const date = new Date(entry.date).toLocaleDateString();
                
                html += `
                    <div class="leaderboard-entry">
                        <div class="rank">${rankIcon}</div>
                        <div class="player-info">
                            <div class="player-name">${entry.name}</div>
                            <div class="player-stats">Level ${entry.level} • ${this.game.formatNumber(entry.clicks)} clicks</div>
                        </div>
                        <div class="score">${this.game.formatNumber(entry.score)}</div>
                        <div class="date">${date}</div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        container.innerHTML = html;
    }
    
    getTopScore() {
        return this.localScores.length > 0 ? this.localScores[0].score : 0;
    }
    
    getPlayerRank(score) {
        return this.localScores.findIndex(entry => entry.score === score) + 1;
    }
    
    reset() {
        this.localScores = [];
        this.saveLocalScores();
        this.updateLeaderboard();
    }
}

// Chat System
class ChatSystem {
    constructor(game) {
        this.game = game;
        this.messages = [];
        this.isOpen = false;
        this.maxMessages = 50;
    }
    
    async init() {
        console.log('💬 Chat system initialized');
        this.setupEventListeners();
        this.addSystemMessage('Welcome to Epic Clicker Tycoon RPG!');
    }
    
    setupEventListeners() {
        const chatToggle = document.getElementById('chatToggle');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        
        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                this.toggleChat();
            });
        }
        
        if (chatSend) {
            chatSend.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }
    
    toggleChat() {
        const chatSystem = document.getElementById('chatSystem');
        const chatToggle = document.getElementById('chatToggle');
        
        if (chatSystem) {
            this.isOpen = !this.isOpen;
            chatSystem.classList.toggle('open', this.isOpen);
            chatToggle.textContent = this.isOpen ? '−' : '+';
        }
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (message) {
            this.addMessage('Player', message);
            chatInput.value = '';
            
            // Process commands
            this.processCommand(message);
        }
    }
    
    addMessage(sender, message, type = 'user') {
        const messageObj = {
            id: Date.now(),
            sender: sender,
            message: message,
            type: type,
            timestamp: Date.now()
        };
        
        this.messages.push(messageObj);
        
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }
        
        this.updateChatDisplay();
    }
    
    addSystemMessage(message) {
        this.addMessage('System', message, 'system');
    }
    
    processCommand(message) {
        const command = message.toLowerCase();
        
        if (command.startsWith('/help')) {
            this.addSystemMessage('Available commands: /help, /stats, /level, /coins, /diamonds');
        } else if (command.startsWith('/stats')) {
            const stats = this.game.gameState.stats;
            this.addSystemMessage(`Stats: Level ${this.game.gameState.level}, ${this.game.formatNumber(this.game.gameState.totalClicks)} clicks, ${this.game.formatNumber(stats.totalCoinsEarned)} coins earned`);
        } else if (command.startsWith('/level')) {
            this.addSystemMessage(`Current level: ${this.game.gameState.level}`);
        } else if (command.startsWith('/coins')) {
            this.addSystemMessage(`Coins: ${this.game.formatNumber(this.game.gameState.coins)}`);
        } else if (command.startsWith('/diamonds')) {
            this.addSystemMessage(`Diamonds: ${this.game.formatNumber(this.game.gameState.diamonds)}`);
        }
    }
    
    updateChatDisplay() {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        
        let html = '';
        
        this.messages.forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            const messageClass = msg.type === 'system' ? 'system-message' : 'user-message';
            
            html += `
                <div class="chat-message ${messageClass}">
                    <div class="message-header">
                        <span class="message-sender">${msg.sender}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-content">${msg.message}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;
    }
    
    clear() {
        this.messages = [];
        this.updateChatDisplay();
    }
}

// Daily System
class DailySystem {
    constructor(game) {
        this.game = game;
        this.dailyRewards = [];
        this.currentStreak = 0;
        this.lastClaimDate = null;
    }
    
    async init() {
        console.log('🎁 Daily system initialized');
        this.setupDailyRewards();
        this.checkDailyClaim();
        this.setupEventListeners();
    }
    
    setupDailyRewards() {
        this.dailyRewards = [
            { day: 1, coins: 100, xp: 50, diamonds: 1 },
            { day: 2, coins: 200, xp: 100, diamonds: 2 },
            { day: 3, coins: 300, xp: 150, diamonds: 3 },
            { day: 4, coins: 400, xp: 200, diamonds: 4 },
            { day: 5, coins: 500, xp: 250, diamonds: 5 },
            { day: 6, coins: 600, xp: 300, diamonds: 6 },
            { day: 7, coins: 1000, xp: 500, diamonds: 10 }
        ];
    }
    
    setupEventListeners() {
        const claimBtn = document.getElementById('claimDailyBtn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                this.claimDailyReward();
            });
        }
    }
    
    checkDailyClaim() {
        const today = new Date().toDateString();
        const lastClaim = this.game.gameState.lastDailyClaim;
        
        if (lastClaim) {
            const lastClaimDate = new Date(lastClaim).toDateString();
            const daysDiff = Math.floor((new Date(today) - new Date(lastClaimDate)) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                // Consecutive day
                this.currentStreak = (this.game.gameState.dailyStreak || 0) + 1;
            } else if (daysDiff > 1) {
                // Streak broken
                this.currentStreak = 0;
            } else if (daysDiff === 0) {
                // Already claimed today
                this.currentStreak = this.game.gameState.dailyStreak || 0;
            }
        }
        
        this.updateDailyDisplay();
    }
    
    claimDailyReward() {
        const today = new Date().toDateString();
        const lastClaim = this.game.gameState.lastDailyClaim;
        
        if (lastClaim) {
            const lastClaimDate = new Date(lastClaim).toDateString();
            if (lastClaimDate === today) {
                this.game.showNotification('❌ Daily reward already claimed today!', 'error');
                return;
            }
        }
        
        // Determine reward day
        let rewardDay = 1;
        if (this.currentStreak > 0) {
            rewardDay = Math.min(this.currentStreak + 1, 7);
        }
        
        const reward = this.dailyRewards[rewardDay - 1];
        
        // Apply rewards
        this.game.gameState.coins += reward.coins;
        this.game.gameState.xp += reward.xp;
        this.game.gameState.diamonds += reward.diamonds;
        
        // Update streak
        this.currentStreak++;
        this.game.gameState.dailyStreak = this.currentStreak;
        this.game.gameState.lastDailyClaim = Date.now();
        
        // Show notification
        this.game.showNotification(
            `🎁 Day ${rewardDay} daily reward claimed! +${reward.coins} coins, +${reward.xp} XP, +${reward.diamonds} diamonds`,
            'success'
        );
        
        // Create particle effect
        this.game.systems.particles.createLevelUpParticles();
        
        // Play sound
        this.game.systems.audio.playSound('achievement');
        
        this.updateDailyDisplay();
    }
    
    updateDailyDisplay() {
        const calendar = document.getElementById('rewardCalendar');
        if (!calendar) return;
        
        let html = '<div class="daily-calendar">';
        
        this.dailyRewards.forEach((reward, index) => {
            const day = index + 1;
            const isClaimed = this.currentStreak >= day;
            const isToday = this.currentStreak + 1 === day;
            const canClaim = this.currentStreak === day - 1;
            
            let dayClass = 'calendar-day';
            if (isClaimed) dayClass += ' claimed';
            if (isToday) dayClass += ' today';
            if (canClaim) dayClass += ' available';
            
            html += `
                <div class="${dayClass}">
                    <div class="day-number">${day}</div>
                    <div class="day-rewards">
                        <div>💰 ${reward.coins}</div>
                        <div>⭐ ${reward.xp}</div>
                        <div>💎 ${reward.diamonds}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add streak info
        html += `
            <div class="streak-info">
                <div class="current-streak">🔥 ${this.currentStreak} day streak</div>
                <div class="next-reward">Next reward: Day ${Math.min(this.currentStreak + 1, 7)}</div>
            </div>
        `;
        
        calendar.innerHTML = html;
    }
    
    canClaimDaily() {
        const today = new Date().toDateString();
        const lastClaim = this.game.gameState.lastDailyClaim;
        
        if (!lastClaim) return true;
        
        const lastClaimDate = new Date(lastClaim).toDateString();
        return lastClaimDate !== today;
    }
    
    getCurrentStreak() {
        return this.currentStreak;
    }
    
    reset() {
        this.currentStreak = 0;
        this.game.gameState.dailyStreak = 0;
        this.game.gameState.lastDailyClaim = null;
        this.updateDailyDisplay();
    }
}

// Prestige System
class PrestigeSystem {
    constructor(game) {
        this.game = game;
        this.prestigeMultiplier = 1;
        this.prestigeCost = 1000000; // 1M coins
    }
    
    async init() {
        console.log('🌟 Prestige system initialized');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const prestigeBtn = document.getElementById('prestigeBtn');
        if (prestigeBtn) {
            prestigeBtn.addEventListener('click', () => {
                this.showPrestigeDialog();
            });
        }
    }
    
    showPrestigeDialog() {
        const currentCoins = this.game.gameState.coins;
        const canPrestige = currentCoins >= this.prestigeCost;
        const prestigeCount = this.game.gameState.prestigeCount || 0;
        const newMultiplier = 1 + (prestigeCount + 1) * 0.5;
        
        const modalData = {
            title: '🌟 Prestige',
            content: `
                <div class="prestige-dialog">
                    <p>Prestige to gain permanent multipliers and start fresh!</p>
                    <div class="prestige-info">
                        <div>Current Prestige: ${prestigeCount}</div>
                        <div>Current Multiplier: ${this.prestigeMultiplier}x</div>
                        <div>New Multiplier: ${newMultiplier}x</div>
                        <div>Prestige Cost: ${this.game.formatNumber(this.prestigeCost)} coins</div>
                        <div>Your Coins: ${this.game.formatNumber(currentCoins)}</div>
                    </div>
                    ${canPrestige ? 
                        '<div class="prestige-warning">⚠️ This will reset your progress but give you permanent bonuses!</div>' :
                        '<div class="prestige-error">❌ Not enough coins to prestige!</div>'
                    }
                </div>
            `,
            buttons: canPrestige ? ['Cancel', 'Prestige'] : ['Close']
        };
        
        this.game.systems.modals.show(modalData, (button) => {
            if (button === 'Prestige') {
                this.performPrestige();
            }
        });
    }
    
    performPrestige() {
        const prestigeCount = this.game.gameState.prestigeCount || 0;
        const newMultiplier = 1 + (prestigeCount + 1) * 0.5;
        
        // Update prestige count and multiplier
        this.game.gameState.prestigeCount = prestigeCount + 1;
        this.game.gameState.prestigeMultiplier = newMultiplier;
        
        // Reset game state
        this.game.gameState.coins = 0;
        this.game.gameState.level = 1;
        this.game.gameState.xp = 0;
        this.game.gameState.xpToNext = 100;
        this.game.gameState.clickPower = 1;
        this.game.gameState.totalClicks = 0;
        this.game.gameState.upgrades = {};
        this.game.gameState.achievements = {};
        this.game.gameState.defeatedBosses = [];
        this.game.gameState.minigamesPlayed = 0;
        
        // Keep some things
        this.game.gameState.unlockedSkins = ['baby_dragon'];
        this.game.gameState.currentSkin = 'baby_dragon';
        this.game.gameState.diamonds = Math.floor(this.game.gameState.diamonds * 0.5); // Keep 50% of diamonds
        
        // Update statistics
        this.game.gameState.stats.totalPrestiges++;
        
        // Show notification
        this.game.showNotification(
            `🌟 Prestige ${prestigeCount + 1} completed! New multiplier: ${newMultiplier}x`,
            'achievement'
        );
        
        // Create particle effect
        this.game.systems.particles.createLevelUpParticles();
        
        // Play sound
        this.game.systems.audio.playSound('achievement');
        
        // Update all systems
        this.game.updateUI();
        this.game.systems.achievements.updateAchievementsDisplay();
        this.game.systems.inventory.updateInventoryDisplay();
        this.game.systems.bosses.updateBossDisplay();
    }
    
    getPrestigeMultiplier() {
        return this.game.gameState.prestigeMultiplier || 1;
    }
    
    getPrestigeCount() {
        return this.game.gameState.prestigeCount || 0;
    }
    
    canPrestige() {
        return this.game.gameState.coins >= this.prestigeCost;
    }
    
    getPrestigeCost() {
        return this.prestigeCost;
    }
    
    reset() {
        this.game.gameState.prestigeCount = 0;
        this.game.gameState.prestigeMultiplier = 1;
        this.prestigeMultiplier = 1;
    }
}