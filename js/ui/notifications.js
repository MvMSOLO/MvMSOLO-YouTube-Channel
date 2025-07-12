// Epic Clicker Tycoon RPG - Notification System

class NotificationSystem {
    constructor(game) {
        this.game = game;
        this.notifications = [];
        this.maxNotifications = 5;
        this.notificationDuration = 5000; // 5 seconds
        this.notificationId = 0;
    }
    
    async init() {
        console.log('🔔 Notification system initialized');
        this.setupContainer();
    }
    
    setupContainer() {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications';
            document.body.appendChild(container);
        }
    }
    
    show(message, type = 'info', duration = null) {
        const id = ++this.notificationId;
        const notification = {
            id: id,
            message: message,
            type: type,
            timestamp: Date.now(),
            duration: duration || this.notificationDuration
        };
        
        this.notifications.push(notification);
        this.renderNotification(notification);
        
        // Remove old notifications if we have too many
        if (this.notifications.length > this.maxNotifications) {
            const oldNotification = this.notifications.shift();
            this.removeNotification(oldNotification.id);
        }
        
        // Auto-remove after duration
        setTimeout(() => {
            this.remove(id);
        }, notification.duration);
        
        return id;
    }
    
    renderNotification(notification) {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification notification-${notification.type}`;
        notificationElement.dataset.notificationId = notification.id;
        
        const icon = this.getNotificationIcon(notification.type);
        
        notificationElement.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icon}</div>
                <div class="notification-message">${notification.message}</div>
                <button class="notification-close" onclick="game.systems.notifications.remove(${notification.id})">&times;</button>
            </div>
            <div class="notification-progress"></div>
        `;
        
        // Add animation classes
        notificationElement.classList.add('notification-enter');
        
        container.appendChild(notificationElement);
        
        // Trigger animation
        setTimeout(() => {
            notificationElement.classList.remove('notification-enter');
            notificationElement.classList.add('notification-active');
        }, 10);
        
        // Start progress bar
        this.startProgressBar(notificationElement, notification.duration);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌',
            'achievement': '🏆',
            'levelup': '⭐',
            'boss': '👹',
            'minigame': '🎮',
            'upgrade': '⚡',
            'skin': '🎨',
            'coin': '💰',
            'diamond': '💎'
        };
        return icons[type] || icons.info;
    }
    
    startProgressBar(element, duration) {
        const progressBar = element.querySelector('.notification-progress');
        if (!progressBar) return;
        
        const startTime = Date.now();
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.max(0, 100 - (elapsed / duration) * 100);
            
            progressBar.style.width = `${progress}%`;
            
            if (progress > 0) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        updateProgress();
    }
    
    remove(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;
        
        // Remove from array
        this.notifications = this.notifications.filter(n => n.id !== id);
        
        // Remove from DOM
        this.removeNotification(id);
    }
    
    removeNotification(id) {
        const element = document.querySelector(`[data-notification-id="${id}"]`);
        if (element) {
            element.classList.add('notification-exit');
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }
    }
    
    clear() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification.id);
        });
        this.notifications = [];
    }
    
    // Convenience methods for different notification types
    showInfo(message, duration = null) {
        return this.show(message, 'info', duration);
    }
    
    showSuccess(message, duration = null) {
        return this.show(message, 'success', duration);
    }
    
    showWarning(message, duration = null) {
        return this.show(message, 'warning', duration);
    }
    
    showError(message, duration = null) {
        return this.show(message, 'error', duration);
    }
    
    showAchievement(message, duration = null) {
        return this.show(message, 'achievement', duration);
    }
    
    showLevelUp(message, duration = null) {
        return this.show(message, 'levelup', duration);
    }
    
    showBoss(message, duration = null) {
        return this.show(message, 'boss', duration);
    }
    
    showMinigame(message, duration = null) {
        return this.show(message, 'minigame', duration);
    }
    
    showUpgrade(message, duration = null) {
        return this.show(message, 'upgrade', duration);
    }
    
    showSkin(message, duration = null) {
        return this.show(message, 'skin', duration);
    }
    
    showCoin(message, duration = null) {
        return this.show(message, 'coin', duration);
    }
    
    showDiamond(message, duration = null) {
        return this.show(message, 'diamond', duration);
    }
    
    // Special notification methods
    showCombo(combo) {
        if (combo >= 10) {
            this.show(`🔥 ${combo}x COMBO!`, 'achievement', 3000);
        } else if (combo >= 5) {
            this.show(`${combo}x Combo!`, 'success', 2000);
        }
    }
    
    showCritical(damage) {
        this.show(`⚔️ CRITICAL HIT! ${this.game.formatNumber(damage)}`, 'achievement', 3000);
    }
    
    showLucky(damage) {
        this.show(`🍀 LUCKY CLICK! ${this.game.formatNumber(damage)}`, 'achievement', 3000);
    }
    
    showBossDefeat(bossName, rewards) {
        this.show(
            `🎉 ${bossName} defeated! +${rewards.coins} coins, +${rewards.xp} XP, +${rewards.diamonds} diamonds`,
            'boss',
            5000
        );
    }
    
    showMinigameComplete(gameName, score, rewards) {
        this.show(
            `🎮 ${gameName} completed! Score: ${score} | +${rewards.coins} coins, +${rewards.xp} XP, +${rewards.diamonds} diamonds`,
            'minigame',
            4000
        );
    }
    
    showUpgradePurchased(upgradeName, level) {
        this.show(`⚡ ${upgradeName} upgraded to level ${level}!`, 'upgrade', 3000);
    }
    
    showSkinUnlocked(skinName) {
        this.show(`🎨 New skin unlocked: ${skinName}!`, 'skin', 4000);
    }
    
    showPrestige(prestigeCount, bonus) {
        this.show(`🌟 Prestige ${prestigeCount} completed! +${bonus}x multiplier!`, 'achievement', 5000);
    }
    
    showDailyReward(day, rewards) {
        this.show(
            `🎁 Day ${day} daily reward! +${rewards.coins} coins, +${rewards.xp} XP, +${rewards.diamonds} diamonds`,
            'success',
            4000
        );
    }
    
    showStreak(streak) {
        this.show(`🔥 ${streak} day streak!`, 'achievement', 3000);
    }
    
    showOfflineEarnings(time, coins, xp) {
        const timeStr = this.formatOfflineTime(time);
        this.show(
            `⏰ Offline earnings (${timeStr}): +${this.game.formatNumber(coins)} coins, +${xp} XP`,
            'info',
            6000
        );
    }
    
    formatOfflineTime(seconds) {
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        return `${Math.floor(seconds / 86400)}d`;
    }
    
    // Toast notifications (shorter, less intrusive)
    showToast(message, type = 'info') {
        return this.show(message, type, 2000);
    }
    
    // Persistent notifications (don't auto-remove)
    showPersistent(message, type = 'info') {
        return this.show(message, type, 0);
    }
    
    // Update existing notification
    update(id, message, type = null) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;
        
        notification.message = message;
        if (type) {
            notification.type = type;
        }
        
        const element = document.querySelector(`[data-notification-id="${id}"]`);
        if (element) {
            const messageElement = element.querySelector('.notification-message');
            const iconElement = element.querySelector('.notification-icon');
            
            if (messageElement) {
                messageElement.textContent = message;
            }
            
            if (iconElement && type) {
                iconElement.textContent = this.getNotificationIcon(type);
            }
        }
    }
    
    // Get notification count
    getCount() {
        return this.notifications.length;
    }
    
    // Get all active notifications
    getAll() {
        return [...this.notifications];
    }
    
    // Check if notification exists
    exists(id) {
        return this.notifications.some(n => n.id === id);
    }
    
    // Pause all notifications (for cutscenes, etc.)
    pause() {
        this.notifications.forEach(notification => {
            const element = document.querySelector(`[data-notification-id="${notification.id}"]`);
            if (element) {
                element.style.animationPlayState = 'paused';
            }
        });
    }
    
    // Resume all notifications
    resume() {
        this.notifications.forEach(notification => {
            const element = document.querySelector(`[data-notification-id="${notification.id}"]`);
            if (element) {
                element.style.animationPlayState = 'running';
            }
        });
    }
}