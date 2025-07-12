// Epic Clicker Tycoon RPG - Main Game Script
let gameState = {
    coins: 0, diamonds: 0, score: 0,
    clickPower: 1, totalClicks: 0, clicksPerSecond: 0,
    level: 1, experience: 0, experienceToNext: 100,
    upgrades: {}, autoClickers: {}, multipliers: { click: 1, global: 1 },
    ownedSkins: ['dragon_basic'], equippedSkin: 'dragon_basic',
    currentBoss: null, bossHealth: 0, bossMaxHealth: 0,
    prestigeLevel: 0, prestigeMultiplier: 1,
    lastDailyReward: 0, dailyStreak: 0,
    achievements: [], settings: { sound: true, particles: true, music: true },
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

const GAME_CONFIG = {
    skins: {
        dragon_basic: { name: 'Basic Dragon', emoji: '🐉', rarity: 'common', cost: 0 },
        dragon_fire: { name: 'Fire Dragon', emoji: '🔥🐉', rarity: 'rare', cost: 2500 },
        dragon_ancient: { name: 'Ancient Dragon', emoji: '🐉🏛️', rarity: 'epic', cost: 15000 },
        dragon_god: { name: 'God Dragon', emoji: '🐉👑', rarity: 'legendary', cost: 100000 }
    },
    upgrades: {
        clickUpgrade1: { name: 'Better Clicks', cost: 100, effect: 2, maxLevel: 10 },
        clickUpgrade2: { name: 'Super Clicks', cost: 500, effect: 3, maxLevel: 5 },
        autoClicker1: { name: 'Basic Auto Clicker', cost: 50, effect: 1, maxLevel: 20 },
        autoClicker2: { name: 'Fast Auto Clicker', cost: 500, effect: 2, maxLevel: 15 }
    },
    bosses: [
        { id: 'goblin', name: 'Goblin', emoji: '👺', health: 100, reward: 50 },
        { id: 'orc', name: 'Orc', emoji: '👹', health: 500, reward: 250 },
        { id: 'troll', name: 'Troll', emoji: '🧌', health: 1000, reward: 500 },
        { id: 'dragon', name: 'Dragon', emoji: '🐉', health: 5000, reward: 2500 }
    ],
    achievements: [
        { id: 'first_click', name: 'First Click', description: 'Click for the first time', reward: 10 },
        { id: 'hundred_clicks', name: 'Century', description: 'Click 100 times', reward: 50 },
        { id: 'first_upgrade', name: 'Upgrader', description: 'Buy your first upgrade', reward: 25 }
    ]
};

function initGame() {
    loadGame();
    setupEventListeners();
    updateUI();
    startGameLoop();
    showNotification('Welcome to Epic Clicker Tycoon RPG!', 'success');
}

function handleClick() {
    const damage = calculateClickDamage();
    gameState.coins += damage;
    gameState.score += damage;
    gameState.totalClicks++;
    gameState.experience += 1;
    
    checkLevelUp();
    checkAchievements();
    
    if (gameState.currentBoss) {
        damageBoss(damage);
    }
    
    createDamageText(damage);
    createParticles();
    playClickSound();
    
    updateUI();
    saveGame();
}

function calculateClickDamage() {
    let damage = gameState.clickPower;
    damage *= gameState.multipliers.click;
    damage *= gameState.multipliers.global;
    damage *= gameState.prestigeMultiplier;
    
    if (Math.random() < 0.1) damage *= 2; // Critical hit
    
    return Math.floor(damage);
}

function autoClick() {
    if (gameState.currentBoss) {
        const damage = calculateClickDamage() * 0.5;
        damageBoss(damage);
    } else {
        const coins = calculateClickDamage() * 0.5;
        gameState.coins += coins;
        gameState.score += coins;
    }
    updateUI();
}

function damageBoss(damage) {
    gameState.bossHealth -= damage;
    if (gameState.bossHealth <= 0) {
        defeatBoss();
    }
    updateBossUI();
}

function defeatBoss() {
    const boss = gameState.currentBoss;
    const reward = boss.reward;
    gameState.coins += reward;
    gameState.score += reward;
    gameState.stats.totalBossesDefeated++;
    gameState.currentBoss = null;
    gameState.bossHealth = 0;
    showNotification(`Defeated ${boss.name}! +${reward} coins`, 'success');
    updateUI();
}

function buyUpgrade(upgradeId) {
    const upgrade = GAME_CONFIG.upgrades[upgradeId];
    const currentLevel = gameState.upgrades[upgradeId] || 0;
    
    if (currentLevel >= upgrade.maxLevel) {
        showNotification('Upgrade already at max level!', 'warning');
        return;
    }
    
    const cost = upgrade.cost * (currentLevel + 1);
    
    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        gameState.upgrades[upgradeId] = (gameState.upgrades[upgradeId] || 0) + 1;
        applyUpgradeEffect(upgradeId);
        showNotification(`Upgraded ${upgrade.name}!`, 'success');
        updateUI();
        saveGame();
    } else {
        showNotification('Not enough coins!', 'error');
    }
}

function applyUpgradeEffect(upgradeId) {
    const upgrade = GAME_CONFIG.upgrades[upgradeId];
    const level = gameState.upgrades[upgradeId];
    
    switch (upgradeId) {
        case 'clickUpgrade1':
        case 'clickUpgrade2':
            gameState.clickPower += upgrade.effect;
            break;
        case 'autoClicker1':
        case 'autoClicker2':
            gameState.clicksPerSecond += upgrade.effect;
            break;
    }
}

function checkLevelUp() {
    if (gameState.experience >= gameState.experienceToNext) {
        gameState.level++;
        gameState.experience -= gameState.experienceToNext;
        gameState.experienceToNext = Math.floor(gameState.experienceToNext * 1.2);
        gameState.coins += gameState.level * 10;
        gameState.diamonds += Math.floor(gameState.level / 10);
        showNotification(`Level Up! You are now level ${gameState.level}!`, 'success');
        updateUI();
    }
}

function checkAchievements() {
    GAME_CONFIG.achievements.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id)) {
            let earned = false;
            
            switch (achievement.id) {
                case 'first_click':
                    earned = gameState.totalClicks >= 1;
                    break;
                case 'hundred_clicks':
                    earned = gameState.totalClicks >= 100;
                    break;
                case 'first_upgrade':
                    earned = Object.keys(gameState.upgrades).length > 0;
                    break;
            }
            
            if (earned) {
                unlockAchievement(achievement);
            }
        }
    });
}

function unlockAchievement(achievement) {
    gameState.achievements.push(achievement.id);
    gameState.coins += achievement.reward;
    showNotification(`Achievement Unlocked: ${achievement.name}! +${achievement.reward} coins`, 'success');
    updateUI();
}

function prestige() {
    if (gameState.score < 1000000) {
        showNotification('You need 1,000,000 score to prestige!', 'warning');
        return;
    }
    
    const prestigeBonus = Math.floor(gameState.score / 1000000);
    
    gameState.coins = 0;
    gameState.score = 0;
    gameState.clickPower = 1;
    gameState.upgrades = {};
    gameState.autoClickers = {};
    gameState.multipliers = { click: 1, global: 1 };
    gameState.level = 1;
    gameState.experience = 0;
    gameState.experienceToNext = 100;
    gameState.currentBoss = null;
    gameState.bossHealth = 0;
    
    gameState.prestigeLevel++;
    gameState.prestigeMultiplier += prestigeBonus * 0.1;
    gameState.stats.totalPrestiges++;
    
    showNotification(`Prestige! +${prestigeBonus * 10}% permanent bonus!`, 'success');
    updateUI();
    saveGame();
}

function updateUI() {
    document.getElementById('coinsDisplay').textContent = formatNumber(gameState.coins);
    document.getElementById('diamondsDisplay').textContent = formatNumber(gameState.diamonds);
    document.getElementById('scoreDisplay').textContent = formatNumber(gameState.score);
    document.getElementById('clickPower').textContent = formatNumber(gameState.clickPower);
    document.getElementById('clicksPerSecond').textContent = formatNumber(gameState.clicksPerSecond);
    document.getElementById('totalClicks').textContent = formatNumber(gameState.totalClicks);
    document.getElementById('levelDisplay').textContent = `Level ${gameState.level}`;
    
    const levelProgress = (gameState.experience / gameState.experienceToNext) * 100;
    document.getElementById('levelProgress').style.width = `${levelProgress}%`;
    
    document.getElementById('prestigeLevel').textContent = gameState.prestigeLevel;
    document.getElementById('prestigeMultiplier').textContent = `${gameState.prestigeMultiplier.toFixed(1)}x`;
    
    const prestigeBtn = document.getElementById('prestigeBtn');
    if (gameState.score >= 1000000) {
        prestigeBtn.disabled = false;
        prestigeBtn.textContent = 'Prestige!';
    } else {
        prestigeBtn.disabled = true;
        prestigeBtn.textContent = `Prestige (Requires ${formatNumber(1000000)} Score)`;
    }
    
    updateSkinDisplay();
    updateShop();
    updateBossUI();
}

function updateSkinDisplay() {
    const skin = GAME_CONFIG.skins[gameState.equippedSkin];
    document.getElementById('objectImage').textContent = skin.emoji;
}

function updateShop() {
    const shopItems = document.getElementById('shopItems');
    shopItems.innerHTML = '';
    
    Object.entries(GAME_CONFIG.upgrades).forEach(([id, upgrade]) => {
        const currentLevel = gameState.upgrades[id] || 0;
        const cost = upgrade.cost * (currentLevel + 1);
        const canAfford = gameState.coins >= cost;
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
                <span>${formatNumber(cost)}</span>
            </div>
        `;
        
        if (!maxed && canAfford) {
            item.addEventListener('click', () => buyUpgrade(id));
        }
        
        shopItems.appendChild(item);
    });
}

function updateBossUI() {
    const bossHealth = document.getElementById('bossHealth');
    const bossImage = document.getElementById('bossImage');
    const bossName = document.getElementById('bossName');
    
    if (gameState.currentBoss) {
        const healthPercent = (gameState.bossHealth / gameState.bossMaxHealth) * 100;
        bossHealth.style.width = `${healthPercent}%`;
        bossImage.textContent = gameState.currentBoss.emoji;
        bossName.textContent = gameState.currentBoss.name;
    } else {
        bossHealth.style.width = '0%';
        bossImage.textContent = '👹';
        bossName.textContent = 'No Boss Active';
    }
    
    const bossList = document.getElementById('bossList');
    bossList.innerHTML = '';
    
    GAME_CONFIG.bosses.forEach(boss => {
        const item = document.createElement('div');
        item.className = 'boss-item';
        item.innerHTML = `
            <span class="boss-item-icon">${boss.emoji}</span>
            <div class="boss-item-info">
                <div class="boss-item-name">${boss.name}</div>
                <div class="boss-item-level">HP: ${formatNumber(boss.health)}</div>
            </div>
        `;
        
        item.addEventListener('click', () => startBossFight(boss));
        bossList.appendChild(item);
    });
}

function startBossFight(boss) {
    gameState.currentBoss = boss;
    gameState.bossHealth = boss.health;
    gameState.bossMaxHealth = boss.health;
    showNotification(`Boss fight started: ${boss.name}!`, 'success');
    updateBossUI();
}

function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

function createDamageText(damage) {
    const damageText = document.getElementById('damageText');
    damageText.textContent = `+${formatNumber(damage)}`;
    damageText.style.animation = 'none';
    damageText.offsetHeight;
    damageText.style.animation = 'damageFloat 1s ease-out forwards';
}

function createParticles() {
    if (!gameState.settings.particles) return;
    
    const particles = document.getElementById('particles');
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particles.appendChild(particle);
    
    setTimeout(() => particle.remove(), 6000);
}

function playClickSound() {
    if (!gameState.settings.sound) return;
    
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.1;
    audio.play().catch(() => {});
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
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

function setupEventListeners() {
    document.getElementById('clickableObject').addEventListener('click', handleClick);
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    document.getElementById('prestigeBtn').addEventListener('click', prestige);
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            switchShopCategory(category);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function switchShopCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    updateShop();
}

function saveGame() {
    localStorage.setItem('epicClickerSave', JSON.stringify(gameState));
}

function loadGame() {
    const save = localStorage.getItem('epicClickerSave');
    if (save) {
        const loadedState = JSON.parse(save);
        gameState = { ...gameState, ...loadedState };
    }
}

function startGameLoop() {
    setInterval(() => {
        if (gameState.clicksPerSecond > 0) {
            autoClick();
        }
    }, 1000);
    
    setInterval(() => {
        saveGame();
    }, 30000);
    
    setInterval(() => {
        gameState.stats.playTime++;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('gameContainer').classList.remove('hidden');
            initGame();
        }, 500);
    }, 2000);
});