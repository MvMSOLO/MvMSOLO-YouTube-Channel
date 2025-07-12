// Epic Clicker Tycoon RPG - Upgrade System

class UpgradeSystem {
    constructor(game) {
        this.game = game;
        this.upgrades = {};
        this.upgradeTrees = {};
        this.maxUpgradeLevel = 100;
    }
    
    async init() {
        console.log('⚡ Upgrade system initialized');
        await this.loadUpgrades();
        this.setupUpgradeTrees();
        this.setupEventListeners();
    }
    
    async loadUpgrades() {
        try {
            const response = await fetch('config/upgrades.json');
            this.upgrades = await response.json();
            console.log('⚡ Upgrades loaded successfully');
        } catch (error) {
            console.warn('Failed to load upgrades config, using defaults');
            this.createDefaultUpgrades();
        }
    }
    
    createDefaultUpgrades() {
        this.upgrades = {
            "click_power": [
                {
                    "id": "basic_click",
                    "name": "Basic Click Power",
                    "description": "Increase your click power by 1",
                    "price": 10,
                    "multiplier": 1.5,
                    "maxLevel": 50,
                    "type": "click_power",
                    "icon": "👊"
                },
                {
                    "id": "strong_click",
                    "name": "Strong Click",
                    "description": "Increase your click power by 2",
                    "price": 100,
                    "multiplier": 2,
                    "maxLevel": 25,
                    "type": "click_power",
                    "icon": "💪",
                    "requires": ["basic_click"]
                }
            ],
            "autoclickers": [
                {
                    "id": "basic_autoclicker",
                    "name": "Basic Auto Clicker",
                    "description": "Automatically clicks once per second",
                    "price": 50,
                    "clicksPerSecond": 1,
                    "maxLevel": 20,
                    "type": "autoclicker",
                    "icon": "🤖"
                },
                {
                    "id": "advanced_autoclicker",
                    "name": "Advanced Auto Clicker",
                    "description": "Automatically clicks twice per second",
                    "price": 500,
                    "clicksPerSecond": 2,
                    "maxLevel": 15,
                    "type": "autoclicker",
                    "icon": "⚡",
                    "requires": ["basic_autoclicker"]
                }
            ],
            "multipliers": [
                {
                    "id": "coin_multiplier",
                    "name": "Coin Multiplier",
                    "description": "Multiply coins earned by 1.5x",
                    "price": 200,
                    "multiplier": 1.5,
                    "maxLevel": 10,
                    "type": "coin_multiplier",
                    "icon": "💰"
                },
                {
                    "id": "diamond_multiplier",
                    "name": "Diamond Multiplier",
                    "description": "Multiply diamonds earned by 2x",
                    "price": 1000,
                    "multiplier": 2,
                    "maxLevel": 5,
                    "type": "diamond_multiplier",
                    "icon": "💎"
                }
            ],
            "critical": [
                {
                    "id": "critical_chance",
                    "name": "Critical Hit Chance",
                    "description": "Increase critical hit chance by 2%",
                    "price": 150,
                    "chance": 0.02,
                    "maxLevel": 20,
                    "type": "critical",
                    "icon": "🎯"
                },
                {
                    "id": "critical_power",
                    "name": "Critical Hit Power",
                    "description": "Increase critical hit multiplier by 0.5x",
                    "price": 300,
                    "multiplier": 0.5,
                    "maxLevel": 10,
                    "type": "critical_power",
                    "icon": "⚔️"
                }
            ],
            "lucky": [
                {
                    "id": "lucky_chance",
                    "name": "Lucky Click Chance",
                    "description": "Increase lucky click chance by 1%",
                    "price": 250,
                    "chance": 0.01,
                    "maxLevel": 15,
                    "type": "lucky",
                    "icon": "🍀"
                },
                {
                    "id": "lucky_power",
                    "name": "Lucky Click Power",
                    "description": "Increase lucky click multiplier by 0.3x",
                    "price": 400,
                    "multiplier": 0.3,
                    "maxLevel": 10,
                    "type": "lucky_power",
                    "icon": "✨"
                }
            ]
        };
    }
    
    setupUpgradeTrees() {
        this.upgradeTrees = {
            "click_power": {
                name: "Click Power",
                description: "Increase your clicking damage",
                icon: "👊",
                upgrades: this.upgrades.click_power || []
            },
            "autoclickers": {
                name: "Auto Clickers",
                description: "Automate your clicking",
                icon: "🤖",
                upgrades: this.upgrades.autoclickers || []
            },
            "multipliers": {
                name: "Multipliers",
                description: "Boost your earnings",
                icon: "💰",
                upgrades: this.upgrades.multipliers || []
            },
            "critical": {
                name: "Critical Hits",
                description: "Master critical strikes",
                icon: "🎯",
                upgrades: this.upgrades.critical || []
            },
            "lucky": {
                name: "Lucky Clicks",
                description: "Harness the power of luck",
                icon: "🍀",
                upgrades: this.upgrades.lucky || []
            }
        };
    }
    
    setupEventListeners() {
        // Upgrade tree navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('upgrade-tree-tab')) {
                const treeName = e.target.dataset.tree;
                this.switchUpgradeTree(treeName);
            }
            
            if (e.target.classList.contains('upgrade-btn')) {
                const upgradeId = e.target.dataset.upgrade;
                this.purchaseUpgrade(upgradeId);
            }
        });
    }
    
    switchUpgradeTree(treeName) {
        // Update active tab
        document.querySelectorAll('.upgrade-tree-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tree="${treeName}"]`).classList.add('active');
        
        // Update tree display
        this.updateUpgradeTreeDisplay(treeName);
    }
    
    updateUpgradeTreeDisplay(treeName) {
        const treeContainer = document.getElementById('upgradeTree');
        if (!treeContainer) return;
        
        const tree = this.upgradeTrees[treeName];
        if (!tree) return;
        
        let html = `
            <div class="upgrade-tree-header">
                <h3>${tree.icon} ${tree.name}</h3>
                <p>${tree.description}</p>
            </div>
            <div class="upgrade-tree-content">
        `;
        
        for (const upgrade of tree.upgrades) {
            const currentLevel = this.game.gameState.upgrades[upgrade.id] || 0;
            const canAfford = this.canAffordUpgrade(upgrade, currentLevel);
            const canPurchase = this.canPurchaseUpgrade(upgrade, currentLevel);
            const cost = this.getUpgradeCost(upgrade, currentLevel);
            
            html += `
                <div class="upgrade-item ${canPurchase ? 'available' : 'locked'} ${canAfford ? 'affordable' : 'expensive'}">
                    <div class="upgrade-icon">${upgrade.icon}</div>
                    <div class="upgrade-info">
                        <div class="upgrade-name">${upgrade.name}</div>
                        <div class="upgrade-description">${upgrade.description}</div>
                        <div class="upgrade-level">Level ${currentLevel}/${upgrade.maxLevel}</div>
                        <div class="upgrade-cost">Cost: ${this.game.formatNumber(cost)} coins</div>
                    </div>
                    <button class="upgrade-btn" data-upgrade="${upgrade.id}" 
                            ${!canPurchase || !canAfford ? 'disabled' : ''}>
                        ${canPurchase ? 'Upgrade' : 'Maxed'}
                    </button>
                </div>
            `;
        }
        
        html += '</div>';
        treeContainer.innerHTML = html;
    }
    
    canAffordUpgrade(upgrade, currentLevel) {
        const cost = this.getUpgradeCost(upgrade, currentLevel);
        return this.game.gameState.coins >= cost;
    }
    
    canPurchaseUpgrade(upgrade, currentLevel) {
        if (currentLevel >= upgrade.maxLevel) return false;
        
        // Check requirements
        if (upgrade.requires) {
            for (const requiredId of upgrade.requires) {
                const requiredLevel = this.game.gameState.upgrades[requiredId] || 0;
                if (requiredLevel === 0) return false;
            }
        }
        
        return true;
    }
    
    getUpgradeCost(upgrade, currentLevel) {
        return Math.floor(upgrade.price * Math.pow(1.15, currentLevel));
    }
    
    purchaseUpgrade(upgradeId) {
        const upgrade = this.getUpgradeById(upgradeId);
        if (!upgrade) return { success: false, message: 'Upgrade not found!' };
        
        const currentLevel = this.game.gameState.upgrades[upgradeId] || 0;
        
        if (!this.canPurchaseUpgrade(upgrade, currentLevel)) {
            return { success: false, message: 'Cannot purchase this upgrade!' };
        }
        
        const cost = this.getUpgradeCost(upgrade, currentLevel);
        
        if (!this.canAffordUpgrade(upgrade, currentLevel)) {
            return { success: false, message: 'Not enough coins!' };
        }
        
        // Purchase the upgrade
        this.game.gameState.coins -= cost;
        this.game.gameState.upgrades[upgradeId] = currentLevel + 1;
        
        // Apply upgrade effects
        this.applyUpgradeEffects(upgrade, currentLevel + 1);
        
        // Update UI
        this.updateUpgradeTreeDisplay(this.getCurrentUpgradeTree());
        this.game.updateUI();
        
        // Show notification
        this.game.showNotification(`⚡ Upgraded ${upgrade.name} to level ${currentLevel + 1}!`, 'success');
        
        // Check achievements
        this.game.systems.achievements.checkUpgradeAchievements();
        
        return { success: true, message: `Upgraded ${upgrade.name}!` };
    }
    
    applyUpgradeEffects(upgrade, level) {
        switch (upgrade.type) {
            case 'click_power':
                // Click power is calculated dynamically
                break;
            case 'autoclicker':
                // Auto clicker effects are handled in the clicking system
                break;
            case 'coin_multiplier':
                this.game.gameState.coinMultiplier *= upgrade.multiplier;
                break;
            case 'diamond_multiplier':
                this.game.gameState.diamondMultiplier *= upgrade.multiplier;
                break;
            case 'critical':
                // Critical effects are calculated dynamically
                break;
            case 'lucky':
                // Lucky effects are calculated dynamically
                break;
        }
    }
    
    getUpgradeById(upgradeId) {
        for (const category in this.upgrades) {
            if (Array.isArray(this.upgrades[category])) {
                const upgrade = this.upgrades[category].find(u => u.id === upgradeId);
                if (upgrade) return upgrade;
            }
        }
        return null;
    }
    
    getCurrentUpgradeTree() {
        const activeTab = document.querySelector('.upgrade-tree-tab.active');
        return activeTab ? activeTab.dataset.tree : 'click_power';
    }
    
    getTotalUpgradeLevel() {
        let total = 0;
        for (const level of Object.values(this.game.gameState.upgrades)) {
            total += level;
        }
        return total;
    }
    
    getUpgradeMultiplier(type) {
        let multiplier = 1;
        
        for (const [upgradeId, level] of Object.entries(this.game.gameState.upgrades)) {
            const upgrade = this.getUpgradeById(upgradeId);
            if (upgrade && upgrade.type === type) {
                if (upgrade.multiplier) {
                    multiplier *= Math.pow(upgrade.multiplier, level);
                }
            }
        }
        
        return multiplier;
    }
    
    getCriticalChance() {
        let chance = 0.05; // Base 5% chance
        
        for (const [upgradeId, level] of Object.entries(this.game.gameState.upgrades)) {
            const upgrade = this.getUpgradeById(upgradeId);
            if (upgrade && upgrade.type === 'critical' && upgrade.chance) {
                chance += upgrade.chance * level;
            }
        }
        
        return Math.min(chance, 0.95); // Cap at 95%
    }
    
    getCriticalMultiplier() {
        let multiplier = 2; // Base 2x multiplier
        
        for (const [upgradeId, level] of Object.entries(this.game.gameState.upgrades)) {
            const upgrade = this.getUpgradeById(upgradeId);
            if (upgrade && upgrade.type === 'critical_power' && upgrade.multiplier) {
                multiplier += upgrade.multiplier * level;
            }
        }
        
        return multiplier;
    }
    
    getLuckyChance() {
        let chance = 0.02; // Base 2% chance
        
        for (const [upgradeId, level] of Object.entries(this.game.gameState.upgrades)) {
            const upgrade = this.getUpgradeById(upgradeId);
            if (upgrade && upgrade.type === 'lucky' && upgrade.chance) {
                chance += upgrade.chance * level;
            }
        }
        
        return Math.min(chance, 0.5); // Cap at 50%
    }
    
    getLuckyMultiplier() {
        let multiplier = 3; // Base 3x multiplier
        
        for (const [upgradeId, level] of Object.entries(this.game.gameState.upgrades)) {
            const upgrade = this.getUpgradeById(upgradeId);
            if (upgrade && upgrade.type === 'lucky_power' && upgrade.multiplier) {
                multiplier += upgrade.multiplier * level;
            }
        }
        
        return multiplier;
    }
    
    getAutoClickerCPS() {
        let totalCPS = 0;
        
        for (const [upgradeId, level] of Object.entries(this.game.gameState.upgrades)) {
            const upgrade = this.getUpgradeById(upgradeId);
            if (upgrade && upgrade.type === 'autoclicker' && upgrade.clicksPerSecond) {
                totalCPS += upgrade.clicksPerSecond * level;
            }
        }
        
        return totalCPS;
    }
    
    update(deltaTime) {
        // Update auto clickers
        const autoClickerCPS = this.getAutoClickerCPS();
        if (autoClickerCPS > 0) {
            const clicksThisFrame = autoClickerCPS * deltaTime;
            for (let i = 0; i < clicksThisFrame; i++) {
                this.game.systems.clicking.handleAutoClick();
            }
        }
    }
    
    reset() {
        this.game.gameState.upgrades = {};
        this.game.gameState.coinMultiplier = 1;
        this.game.gameState.diamondMultiplier = 1;
        this.updateUpgradeTreeDisplay(this.getCurrentUpgradeTree());
    }
}