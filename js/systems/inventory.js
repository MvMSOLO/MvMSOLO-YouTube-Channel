// Epic Clicker Tycoon RPG - Inventory System

class InventorySystem {
    constructor(game) {
        this.game = game;
        this.inventory = {
            skins: [],
            items: [],
            chests: [],
            achievements: []
        };
        this.currentTab = 'skins';
    }
    
    async init() {
        console.log('🎒 Inventory system initialized');
        this.setupEventListeners();
        this.loadInventory();
    }
    
    setupEventListeners() {
        // Inventory tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('inv-tab')) {
                const tabName = e.target.dataset.inv;
                this.switchTab(tabName);
            }
            
            if (e.target.classList.contains('inventory-item')) {
                const itemId = e.target.dataset.item;
                const itemType = e.target.dataset.type;
                this.showItemDetails(itemId, itemType);
            }
            
            if (e.target.classList.contains('equip-skin-btn')) {
                const skinId = e.target.dataset.skin;
                this.equipSkin(skinId);
            }
            
            if (e.target.classList.contains('open-chest-btn')) {
                const chestId = e.target.dataset.chest;
                this.openChest(chestId);
            }
        });
    }
    
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update active tab
        document.querySelectorAll('.inv-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-inv="${tabName}"]`).classList.add('active');
        
        // Update content
        this.updateInventoryDisplay();
    }
    
    loadInventory() {
        // Load skins from game state
        this.inventory.skins = this.game.gameState.unlockedSkins.map(skinId => {
            const skin = this.game.systems.shop.getSkinById(skinId);
            return {
                id: skinId,
                type: 'skin',
                data: skin,
                equipped: this.game.gameState.currentSkin === skinId
            };
        });
        
        // Load achievements from game state
        this.inventory.achievements = Object.entries(this.game.gameState.achievements)
            .filter(([id, data]) => data.unlocked)
            .map(([id, data]) => {
                const achievement = this.game.systems.achievements.getAchievementById(id);
                return {
                    id: id,
                    type: 'achievement',
                    data: achievement,
                    unlockedAt: data.unlockedAt
                };
            });
        
        // Load items (placeholder for future items)
        this.inventory.items = [];
        
        // Load chests (placeholder for future chests)
        this.inventory.chests = [];
    }
    
    updateInventoryDisplay() {
        const container = document.getElementById('inventoryContent');
        if (!container) return;
        
        switch (this.currentTab) {
            case 'skins':
                this.updateSkinsDisplay(container);
                break;
            case 'items':
                this.updateItemsDisplay(container);
                break;
            case 'chests':
                this.updateChestsDisplay(container);
                break;
            case 'achievements':
                this.updateAchievementsDisplay(container);
                break;
        }
    }
    
    updateSkinsDisplay(container) {
        let html = `
            <div class="inventory-header">
                <h3>🎨 Skins (${this.inventory.skins.length})</h3>
                <div class="inventory-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="common">Common</button>
                    <button class="filter-btn" data-filter="rare">Rare</button>
                    <button class="filter-btn" data-filter="epic">Epic</button>
                    <button class="filter-btn" data-filter="legendary">Legendary</button>
                </div>
            </div>
            <div class="inventory-grid">
        `;
        
        if (this.inventory.skins.length === 0) {
            html += '<div class="empty-inventory">No skins unlocked yet!</div>';
        } else {
            this.inventory.skins.forEach(skin => {
                const rarityClass = skin.data.rarity || 'common';
                const equippedClass = skin.equipped ? 'equipped' : '';
                
                html += `
                    <div class="inventory-item skin-item ${rarityClass} ${equippedClass}" 
                         data-item="${skin.id}" data-type="skin">
                        <div class="item-icon">${skin.data.emoji}</div>
                        <div class="item-info">
                            <div class="item-name">${skin.data.name}</div>
                            <div class="item-rarity">${this.getRarityName(skin.data.rarity)}</div>
                            <div class="item-description">${skin.data.description}</div>
                        </div>
                        <div class="item-actions">
                            ${skin.equipped ? 
                                '<span class="equipped-badge">Equipped</span>' : 
                                `<button class="equip-skin-btn" data-skin="${skin.id}">Equip</button>`
                            }
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    updateItemsDisplay(container) {
        let html = `
            <div class="inventory-header">
                <h3>📦 Items (${this.inventory.items.length})</h3>
            </div>
            <div class="inventory-grid">
        `;
        
        if (this.inventory.items.length === 0) {
            html += '<div class="empty-inventory">No items in inventory!</div>';
        } else {
            this.inventory.items.forEach(item => {
                html += `
                    <div class="inventory-item item-item" data-item="${item.id}" data-type="item">
                        <div class="item-icon">${item.data.icon}</div>
                        <div class="item-info">
                            <div class="item-name">${item.data.name}</div>
                            <div class="item-description">${item.data.description}</div>
                        </div>
                        <div class="item-actions">
                            <button class="use-item-btn" data-item="${item.id}">Use</button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    updateChestsDisplay(container) {
        let html = `
            <div class="inventory-header">
                <h3>🎁 Chests (${this.inventory.chests.length})</h3>
            </div>
            <div class="inventory-grid">
        `;
        
        if (this.inventory.chests.length === 0) {
            html += '<div class="empty-inventory">No chests in inventory!</div>';
        } else {
            this.inventory.chests.forEach(chest => {
                html += `
                    <div class="inventory-item chest-item" data-item="${chest.id}" data-type="chest">
                        <div class="item-icon">${chest.data.icon}</div>
                        <div class="item-info">
                            <div class="item-name">${chest.data.name}</div>
                            <div class="item-description">${chest.data.description}</div>
                        </div>
                        <div class="item-actions">
                            <button class="open-chest-btn" data-chest="${chest.id}">Open</button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    updateAchievementsDisplay(container) {
        let html = `
            <div class="inventory-header">
                <h3>🏆 Achievements (${this.inventory.achievements.length})</h3>
            </div>
            <div class="inventory-grid">
        `;
        
        if (this.inventory.achievements.length === 0) {
            html += '<div class="empty-inventory">No achievements unlocked yet!</div>';
        } else {
            this.inventory.achievements.forEach(achievement => {
                const unlockedDate = new Date(achievement.unlockedAt).toLocaleDateString();
                
                html += `
                    <div class="inventory-item achievement-item" data-item="${achievement.id}" data-type="achievement">
                        <div class="item-icon">${achievement.data.icon}</div>
                        <div class="item-info">
                            <div class="item-name">${achievement.data.name}</div>
                            <div class="item-description">${achievement.data.description}</div>
                            <div class="item-date">Unlocked: ${unlockedDate}</div>
                        </div>
                        <div class="item-actions">
                            <span class="achievement-badge">Unlocked</span>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    showItemDetails(itemId, itemType) {
        let item = null;
        let title = '';
        let content = '';
        
        switch (itemType) {
            case 'skin':
                item = this.inventory.skins.find(s => s.id === itemId);
                if (item) {
                    title = `${item.data.emoji} ${item.data.name}`;
                    content = `
                        <div class="item-details">
                            <div class="item-rarity">${this.getRarityName(item.data.rarity)}</div>
                            <p>${item.data.description}</p>
                            <div class="item-stats">
                                <div>Click Power: +${item.data.clickPower}</div>
                                ${item.data.effects ? `<div>Effects: ${item.data.effects.join(', ')}</div>` : ''}
                            </div>
                            <div class="item-actions">
                                ${item.equipped ? 
                                    '<span class="equipped-badge">Currently Equipped</span>' : 
                                    `<button class="equip-skin-btn" data-skin="${itemId}">Equip Skin</button>`
                                }
                            </div>
                        </div>
                    `;
                }
                break;
                
            case 'achievement':
                item = this.inventory.achievements.find(a => a.id === itemId);
                if (item) {
                    title = `${item.data.icon} ${item.data.name}`;
                    content = `
                        <div class="item-details">
                            <div class="item-rarity">${this.getRarityName(item.data.rarity)}</div>
                            <p>${item.data.description}</p>
                            <div class="item-rewards">
                                <h4>Rewards:</h4>
                                ${item.data.reward.coins ? `<div>💰 ${item.data.reward.coins} coins</div>` : ''}
                                ${item.data.reward.diamonds ? `<div>💎 ${item.data.reward.diamonds} diamonds</div>` : ''}
                                ${item.data.reward.xp ? `<div>⭐ ${item.data.reward.xp} XP</div>` : ''}
                            </div>
                            <div class="item-date">
                                Unlocked: ${new Date(item.unlockedAt).toLocaleString()}
                            </div>
                        </div>
                    `;
                }
                break;
        }
        
        if (item) {
            const modalData = {
                title: title,
                content: content,
                buttons: ['Close']
            };
            
            this.game.systems.modals.show(modalData);
        }
    }
    
    equipSkin(skinId) {
        const skin = this.inventory.skins.find(s => s.id === skinId);
        if (!skin) return;
        
        // Update game state
        this.game.gameState.currentSkin = skinId;
        
        // Update inventory
        this.inventory.skins.forEach(s => s.equipped = s.id === skinId);
        
        // Update display
        this.updateInventoryDisplay();
        
        // Show notification
        this.game.showNotification(`🎨 Equipped ${skin.data.name}!`, 'skin');
        
        // Create particle effect
        this.game.systems.particles.createSkinChangeParticles(skinId);
        
        // Play sound
        this.game.systems.audio.playSound('skin_change');
    }
    
    openChest(chestId) {
        // Placeholder for chest opening logic
        this.game.showNotification('🎁 Chest opened! (Feature coming soon)', 'info');
    }
    
    addItem(itemId, itemType, itemData) {
        const item = {
            id: itemId,
            type: itemType,
            data: itemData,
            addedAt: Date.now()
        };
        
        this.inventory[itemType + 's'].push(item);
        this.updateInventoryDisplay();
        
        return item;
    }
    
    removeItem(itemId, itemType) {
        const items = this.inventory[itemType + 's'];
        const index = items.findIndex(item => item.id === itemId);
        
        if (index !== -1) {
            items.splice(index, 1);
            this.updateInventoryDisplay();
            return true;
        }
        
        return false;
    }
    
    hasItem(itemId, itemType) {
        const items = this.inventory[itemType + 's'];
        return items.some(item => item.id === itemId);
    }
    
    getItem(itemId, itemType) {
        const items = this.inventory[itemType + 's'];
        return items.find(item => item.id === itemId);
    }
    
    getRarityName(rarity) {
        const names = {
            'common': 'Common',
            'rare': 'Rare',
            'epic': 'Epic',
            'legendary': 'Legendary',
            'godly': 'Godly',
            'expensive': 'Expensive'
        };
        return names[rarity] || rarity;
    }
    
    getInventoryCount() {
        return {
            skins: this.inventory.skins.length,
            items: this.inventory.items.length,
            chests: this.inventory.chests.length,
            achievements: this.inventory.achievements.length
        };
    }
    
    update() {
        // Refresh inventory data
        this.loadInventory();
        this.updateInventoryDisplay();
    }
    
    reset() {
        this.inventory = {
            skins: [],
            items: [],
            chests: [],
            achievements: []
        };
        this.currentTab = 'skins';
        this.updateInventoryDisplay();
    }
}