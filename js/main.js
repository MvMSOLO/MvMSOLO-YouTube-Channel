// Epic Clicker Tycoon RPG - Main Entry Point

// Global game instance
let game;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🎮 Starting Epic Clicker Tycoon RPG...');
        
        // Create global game instance
        game = new EpicClickerGame();
        
        // Initialize the game
        await game.init();
        
        // Set up developer console
        setupDeveloperConsole();
        
        // Set up cheat codes
        setupCheatCodes();
        
        // Set up easter eggs
        setupEasterEggs();
        
        console.log('✅ Epic Clicker Tycoon RPG is ready!');
        
    } catch (error) {
        console.error('❌ Failed to start game:', error);
        showErrorMessage('Failed to start game. Please refresh the page.');
    }
});

// Developer Console Setup
function setupDeveloperConsole() {
    const consoleInput = document.getElementById('consoleInput');
    const consoleOutput = document.getElementById('consoleOutput');
    const consoleSend = document.getElementById('consoleSend');
    const consoleToggle = document.getElementById('consoleToggle');
    
    if (!consoleInput || !consoleOutput || !consoleSend || !consoleToggle) return;
    
    // Console toggle
    consoleToggle.addEventListener('click', () => {
        const console = document.getElementById('devConsole');
        console.classList.toggle('active');
    });
    
    // Console input handling
    function executeCommand(command) {
        const args = command.trim().split(' ');
        const cmd = args[0].toLowerCase();
        
        logToConsole(`> ${command}`, 'input');
        
        try {
            switch (cmd) {
                case 'help':
                    showHelp();
                    break;
                case 'coins':
                    const coinAmount = parseInt(args[1]) || 1000;
                    game.systems.clicking.addCoins(coinAmount);
                    break;
                case 'diamonds':
                    const diamondAmount = parseInt(args[1]) || 100;
                    game.systems.clicking.addDiamonds(diamondAmount);
                    break;
                case 'level':
                    const level = parseInt(args[1]) || 10;
                    game.gameState.level = level;
                    game.gameState.xp = 0;
                    game.gameState.xpToNext = 100;
                    game.showNotification(`🎉 Level set to ${level}!`, 'success');
                    break;
                case 'power':
                    const power = parseInt(args[1]) || 100;
                    game.systems.clicking.setClickPower(power);
                    break;
                case 'multiply':
                    const multiplier = parseFloat(args[1]) || 2;
                    game.systems.clicking.multiplyClickPower(multiplier);
                    break;
                case 'skin':
                    const skinId = args[1];
                    if (skinId) {
                        game.gameState.currentSkin = skinId;
                        game.gameState.unlockedSkins.push(skinId);
                        game.showNotification(`🎨 Skin changed to ${skinId}!`, 'success');
                    }
                    break;
                case 'unlock':
                    const unlockType = args[1];
                    const unlockId = args[2];
                    if (unlockType === 'skin' && unlockId) {
                        game.gameState.unlockedSkins.push(unlockId);
                        game.showNotification(`🔓 Unlocked skin: ${unlockId}!`, 'success');
                    }
                    break;
                case 'prestige':
                    const prestigeCount = parseInt(args[1]) || 1;
                    game.gameState.prestigeCount += prestigeCount;
                    game.gameState.prestigeMultiplier = 1 + (game.gameState.prestigeCount * 0.5);
                    game.showNotification(`🌟 Prestige count increased by ${prestigeCount}!`, 'success');
                    break;
                case 'boss':
                    const bossId = args[1];
                    if (bossId) {
                        game.gameState.defeatedBosses.push(bossId);
                        game.showNotification(`👹 Boss ${bossId} defeated!`, 'success');
                    }
                    break;
                case 'achievement':
                    const achievementId = args[1];
                    if (achievementId) {
                        game.gameState.achievements[achievementId] = true;
                        game.showNotification(`🏆 Achievement unlocked: ${achievementId}!`, 'success');
                    }
                    break;
                case 'stats':
                    showStats();
                    break;
                case 'save':
                    game.save();
                    logToConsole('Game saved successfully!', 'success');
                    break;
                case 'load':
                    game.load();
                    logToConsole('Game loaded successfully!', 'success');
                    break;
                case 'reset':
                    if (confirm('Are you sure you want to reset the game?')) {
                        game.reset();
                    }
                    break;
                case 'clear':
                    consoleOutput.innerHTML = '';
                    break;
                default:
                    logToConsole(`Unknown command: ${cmd}. Type 'help' for available commands.`, 'error');
            }
        } catch (error) {
            logToConsole(`Error: ${error.message}`, 'error');
        }
    }
    
    // Console send button
    consoleSend.addEventListener('click', () => {
        const command = consoleInput.value;
        if (command.trim()) {
            executeCommand(command);
            consoleInput.value = '';
        }
    });
    
    // Console enter key
    consoleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = consoleInput.value;
            if (command.trim()) {
                executeCommand(command);
                consoleInput.value = '';
            }
        }
    });
    
    function logToConsole(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `console-log console-${type}`;
        logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
        
        consoleOutput.appendChild(logEntry);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    function showHelp() {
        const helpText = `
Available Commands:
- help: Show this help message
- coins [amount]: Add coins (default: 1000)
- diamonds [amount]: Add diamonds (default: 100)
- level [level]: Set player level (default: 10)
- power [amount]: Set click power (default: 100)
- multiply [factor]: Multiply click power (default: 2)
- skin [id]: Change current skin
- unlock skin [id]: Unlock a skin
- prestige [count]: Add prestige count (default: 1)
- boss [id]: Defeat a boss
- achievement [id]: Unlock an achievement
- stats: Show game statistics
- save: Save the game
- load: Load the game
- reset: Reset the game
- clear: Clear console
        `;
        logToConsole(helpText, 'info');
    }
    
    function showStats() {
        const stats = game.gameState.stats;
        const statsText = `
Game Statistics:
- Total Play Time: ${formatTime(stats.totalPlayTime)}
- Total Clicks: ${game.formatNumber(game.gameState.totalClicks)}
- Total Coins Earned: ${game.formatNumber(stats.totalCoinsEarned)}
- Total Diamonds Earned: ${game.formatNumber(stats.totalDiamondsEarned)}
- Total Score Earned: ${game.formatNumber(stats.totalScoreEarned)}
- Total Upgrades Purchased: ${stats.totalUpgradesPurchased}
- Total Skins Unlocked: ${stats.totalSkinsUnlocked}
- Total Bosses Defeated: ${stats.totalBossesDefeated}
- Total Minigames Played: ${stats.totalMinigamesPlayed}
- Total Prestiges: ${stats.totalPrestiges}
- Fastest Click: ${stats.fastestClick}ms
- Longest Session: ${formatTime(stats.longestSession)}
- Most Coins in Session: ${game.formatNumber(stats.mostCoinsInSession)}
        `;
        logToConsole(statsText, 'info');
    }
    
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secs}s`;
    }
    
    // Welcome message
    logToConsole('Epic Clicker Tycoon RPG Developer Console', 'info');
    logToConsole('Type "help" for available commands', 'info');
}

// Cheat Codes Setup
function setupCheatCodes() {
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        // Keep only the last 10 keys
        if (konamiCode.length > 10) {
            konamiCode.shift();
        }
        
        // Check for Konami code
        if (konamiCode.length === 10) {
            const isKonami = konamiCode.every((code, index) => code === konamiSequence[index]);
            if (isKonami) {
                activateKonamiCode();
                konamiCode = [];
            }
        }
        
        // Check for other cheat codes
        checkCheatCodes(e);
    });
}

function activateKonamiCode() {
    game.showNotification('🎮 Konami Code Activated!', 'success');
    
    // Give massive rewards
    game.gameState.coins += 1000000;
    game.gameState.diamonds += 10000;
    game.gameState.clickPower *= 10;
    
    // Unlock all skins
    const allSkins = Object.values(game.systems.shop.getAllSkins());
    allSkins.forEach(skin => {
        if (!game.gameState.unlockedSkins.includes(skin.id)) {
            game.gameState.unlockedSkins.push(skin.id);
        }
    });
    
    // Unlock all achievements
    const allAchievements = Object.values(game.systems.achievements.getAllAchievements());
    allAchievements.forEach(achievement => {
        game.gameState.achievements[achievement.id] = true;
    });
    
    game.showNotification('🌟 All skins and achievements unlocked!', 'success');
}

function checkCheatCodes(e) {
    // God mode
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        game.gameState.clickPower = 999999;
        game.gameState.coins = 999999999;
        game.gameState.diamonds = 999999;
        game.showNotification('👑 God Mode Activated!', 'success');
    }
    
    // Infinite money
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        game.gameState.coins = 999999999;
        game.gameState.diamonds = 999999;
        game.showNotification('💰 Infinite Money Activated!', 'success');
    }
    
    // Max level
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        game.gameState.level = 1000;
        game.gameState.xp = 0;
        game.gameState.xpToNext = 100;
        game.showNotification('📈 Max Level Activated!', 'success');
    }
}

// Easter Eggs Setup
function setupEasterEggs() {
    // Secret click areas
    setupSecretClickAreas();
    
    // Hidden messages
    setupHiddenMessages();
    
    // Random events
    setupRandomEvents();
}

function setupSecretClickAreas() {
    // Create hidden clickable areas
    const secretAreas = [
        { x: 50, y: 50, size: 30, reward: 1000, message: '🎁 Secret treasure found!' },
        { x: window.innerWidth - 80, y: 50, size: 30, reward: 1000, message: '💎 Hidden gem discovered!' },
        { x: 50, y: window.innerHeight - 80, size: 30, reward: 1000, message: '🌟 Lucky star found!' },
        { x: window.innerWidth - 80, y: window.innerHeight - 80, size: 30, reward: 1000, message: '🔥 Secret fire found!' }
    ];
    
    secretAreas.forEach(area => {
        const secretElement = document.createElement('div');
        secretElement.style.position = 'fixed';
        secretElement.style.left = `${area.x}px`;
        secretElement.style.top = `${area.y}px`;
        secretElement.style.width = `${area.size}px`;
        secretElement.style.height = `${area.size}px`;
        secretElement.style.cursor = 'pointer';
        secretElement.style.zIndex = '9999';
        secretElement.style.opacity = '0';
        
        secretElement.addEventListener('click', () => {
            game.gameState.coins += area.reward;
            game.showNotification(area.message, 'success');
            secretElement.style.display = 'none';
        });
        
        document.body.appendChild(secretElement);
    });
}

function setupHiddenMessages() {
    // Hidden messages in console
    const hiddenMessages = [
        'The cake is a lie.',
        'There is no spoon.',
        'All your base are belong to us.',
        'It\'s dangerous to go alone!',
        'The princess is in another castle.',
        'Would you kindly...',
        'The numbers, Mason!',
        'I am error.',
        'A winner is you!',
        'Thank you Mario! But our princess is in another castle!'
    ];
    
    let messageIndex = 0;
    
    // Show hidden message every 1000 clicks
    const originalHandleClick = game.systems.clicking.handleClick;
    game.systems.clicking.handleClick = function(x, y, source) {
        originalHandleClick.call(this, x, y, source);
        
        if (game.gameState.totalClicks % 1000 === 0 && game.gameState.totalClicks > 0) {
            const message = hiddenMessages[messageIndex % hiddenMessages.length];
            game.showNotification(`💭 ${message}`, 'info');
            messageIndex++;
        }
    };
}

function setupRandomEvents() {
    // Random events that can occur
    const randomEvents = [
        {
            name: 'Meteor Shower',
            message: '☄️ A meteor shower has appeared! Click power doubled for 30 seconds!',
            effect: () => {
                const originalPower = game.gameState.clickPower;
                game.gameState.clickPower *= 2;
                setTimeout(() => {
                    game.gameState.clickPower = originalPower;
                    game.showNotification('☄️ Meteor shower has ended.', 'info');
                }, 30000);
            }
        },
        {
            name: 'Golden Hour',
            message: '🌟 Golden hour has begun! All coin earnings tripled for 60 seconds!',
            effect: () => {
                const originalMultiplier = game.gameState.coinMultiplier;
                game.gameState.coinMultiplier *= 3;
                setTimeout(() => {
                    game.gameState.coinMultiplier = originalMultiplier;
                    game.showNotification('🌟 Golden hour has ended.', 'info');
                }, 60000);
            }
        },
        {
            name: 'Lucky Day',
            message: '🍀 It\'s your lucky day! Diamond drop rate increased for 2 minutes!',
            effect: () => {
                // Increase diamond drop rate temporarily
                setTimeout(() => {
                    game.showNotification('🍀 Lucky day has ended.', 'info');
                }, 120000);
            }
        }
    ];
    
    // Trigger random event every 5 minutes
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance
            const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            game.showNotification(event.message, 'success');
            event.effect();
        }
    }, 300000); // 5 minutes
}

// Error handling
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ef4444;
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `
        <h3>❌ Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
        </button>
    `;
    document.body.appendChild(errorDiv);
}

// Performance monitoring
function setupPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkPerformance() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            if (fps < 30) {
                console.warn(`⚠️ Low FPS detected: ${fps}`);
                game.showNotification('⚠️ Low performance detected. Consider reducing particle effects.', 'warning');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkPerformance);
    }
    
    requestAnimationFrame(checkPerformance);
}

// Auto-save reminder
function setupAutoSaveReminder() {
    let lastSaveTime = Date.now();
    
    setInterval(() => {
        const timeSinceLastSave = Date.now() - lastSaveTime;
        const minutesSinceLastSave = Math.floor(timeSinceLastSave / 60000);
        
        if (minutesSinceLastSave >= 5) {
            game.showNotification('💾 Remember to save your progress!', 'info');
            lastSaveTime = Date.now();
        }
    }, 300000); // Check every 5 minutes
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    setupPerformanceMonitoring();
    setupAutoSaveReminder();
});

// Export for global access
window.EpicClickerGame = EpicClickerGame;
window.game = game;