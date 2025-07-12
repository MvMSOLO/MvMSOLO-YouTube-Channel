// Epic Clicker Tycoon RPG - Modal System

class ModalSystem {
    constructor(game) {
        this.game = game;
        this.currentModal = null;
        this.modalStack = [];
        this.isModalOpen = false;
    }
    
    async init() {
        console.log('📋 Modal system initialized');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hide();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.hide();
            }
        });
        
        // Close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close')) {
                this.hide();
            }
        });
    }
    
    show(modalData, callback = null) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        if (!modalOverlay || !modal || !modalTitle || !modalContent) {
            console.error('Modal elements not found');
            return;
        }
        
        // Set modal title
        modalTitle.textContent = modalData.title || 'Modal';
        
        // Set modal content
        modalContent.innerHTML = modalData.content || '';
        
        // Create buttons
        if (modalData.buttons && modalData.buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'modal-buttons';
            
            modalData.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.className = 'modal-btn';
                button.textContent = buttonText;
                button.dataset.buttonIndex = index;
                
                button.addEventListener('click', () => {
                    if (callback) {
                        callback(buttonText);
                    }
                    this.hide();
                });
                
                buttonContainer.appendChild(button);
            });
            
            modalContent.appendChild(buttonContainer);
        }
        
        // Show modal
        modalOverlay.classList.add('active');
        modal.classList.add('active');
        this.isModalOpen = true;
        this.currentModal = modalData;
        
        // Add to stack
        this.modalStack.push(modalData);
        
        // Focus first input if any
        setTimeout(() => {
            const firstInput = modalContent.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        // Play sound
        this.game.systems.audio.playSound('modal_open');
    }
    
    hide() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modal = document.getElementById('modal');
        
        if (modalOverlay && modal) {
            modalOverlay.classList.remove('active');
            modal.classList.remove('active');
        }
        
        this.isModalOpen = false;
        this.currentModal = null;
        
        // Remove from stack
        if (this.modalStack.length > 0) {
            this.modalStack.pop();
        }
        
        // Play sound
        this.game.systems.audio.playSound('modal_close');
    }
    
    showConfirm(message, onConfirm, onCancel = null) {
        const modalData = {
            title: 'Confirm Action',
            content: `
                <div class="confirm-dialog">
                    <p>${message}</p>
                </div>
            `,
            buttons: ['Cancel', 'Confirm']
        };
        
        this.show(modalData, (button) => {
            if (button === 'Confirm' && onConfirm) {
                onConfirm();
            } else if (button === 'Cancel' && onCancel) {
                onCancel();
            }
        });
    }
    
    showAlert(message, onOk = null) {
        const modalData = {
            title: 'Alert',
            content: `
                <div class="alert-dialog">
                    <p>${message}</p>
                </div>
            `,
            buttons: ['OK']
        };
        
        this.show(modalData, (button) => {
            if (button === 'OK' && onOk) {
                onOk();
            }
        });
    }
    
    showInput(prompt, defaultValue = '', onConfirm, onCancel = null) {
        const modalData = {
            title: 'Input',
            content: `
                <div class="input-dialog">
                    <p>${prompt}</p>
                    <input type="text" id="modalInput" value="${defaultValue}" placeholder="Enter value...">
                </div>
            `,
            buttons: ['Cancel', 'OK']
        };
        
        this.show(modalData, (button) => {
            if (button === 'OK') {
                const input = document.getElementById('modalInput');
                const value = input ? input.value : defaultValue;
                if (onConfirm) {
                    onConfirm(value);
                }
            } else if (button === 'Cancel' && onCancel) {
                onCancel();
            }
        });
    }
    
    showLoading(message = 'Loading...') {
        const modalData = {
            title: 'Loading',
            content: `
                <div class="loading-dialog">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            `,
            buttons: []
        };
        
        this.show(modalData);
    }
    
    hideLoading() {
        this.hide();
    }
    
    showError(message, onOk = null) {
        const modalData = {
            title: 'Error',
            content: `
                <div class="error-dialog">
                    <p>❌ ${message}</p>
                </div>
            `,
            buttons: ['OK']
        };
        
        this.show(modalData, (button) => {
            if (button === 'OK' && onOk) {
                onOk();
            }
        });
    }
    
    showSuccess(message, onOk = null) {
        const modalData = {
            title: 'Success',
            content: `
                <div class="success-dialog">
                    <p>✅ ${message}</p>
                </div>
            `,
            buttons: ['OK']
        };
        
        this.show(modalData, (button) => {
            if (button === 'OK' && onOk) {
                onOk();
            }
        });
    }
    
    showStats(stats) {
        const modalData = {
            title: 'Game Statistics',
            content: `
                <div class="stats-dialog">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Total Play Time:</span>
                            <span class="stat-value">${this.formatTime(stats.totalPlayTime)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Clicks:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalClicks)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Coins Earned:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalCoinsEarned)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Diamonds Earned:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalDiamondsEarned)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Score Earned:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalScoreEarned)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Upgrades Purchased:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalUpgradesPurchased)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Skins Unlocked:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalSkinsUnlocked)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Bosses Defeated:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalBossesDefeated)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Minigames Played:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalMinigamesPlayed)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Prestiges:</span>
                            <span class="stat-value">${this.game.formatNumber(stats.totalPrestiges)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Fastest Click:</span>
                            <span class="stat-value">${stats.fastestClick}ms</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Longest Session:</span>
                            <span class="stat-value">${this.formatTime(stats.longestSession)}</span>
                        </div>
                    </div>
                </div>
            `,
            buttons: ['Close']
        };
        
        this.show(modalData);
    }
    
    formatTime(seconds) {
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
    
    isOpen() {
        return this.isModalOpen;
    }
    
    getCurrentModal() {
        return this.currentModal;
    }
    
    getModalStack() {
        return [...this.modalStack];
    }
    
    clearStack() {
        this.modalStack = [];
        this.hide();
    }
}