// Epic Clicker Tycoon RPG - Shop System

class ShopSystem {
    constructor(game) {
        this.game = game;
        this.skins = {};
        this.loadSkins();
    }
    
    async init() {
        console.log('🛒 Shop system initialized');
    }
    
    loadSkins() {
        // Load skins from config
        fetch('config/skins.json')
            .then(response => response.json())
            .then(data => {
                this.skins = data.skins;
                console.log('🎨 Skins loaded:', Object.keys(this.skins).length);
            })
            .catch(error => {
                console.warn('Failed to load skins config, using defaults');
                this.loadDefaultSkins();
            });
    }
    
    loadDefaultSkins() {
        this.skins = {
            common: [
                {
                    id: 'baby_dragon',
                    name: 'Baby Dragon',
                    emoji: '🐉',
                    rarity: 'common',
                    price: 100,
                    clickPower: 1,
                    description: 'A cute little dragon just learning to breathe fire',
                    effects: ['fire_particles'],
                    sound: 'dragon_roar.mp3',
                    unlocked: true
                }
            ]
        };
    }
    
    getSkinById(skinId) {
        for (const rarity in this.skins) {
            const skin = this.skins[rarity].find(s => s.id === skinId);
            if (skin) return skin;
        }
        return null;
    }
    
    getAllSkins() {
        const allSkins = {};
        for (const rarity in this.skins) {
            this.skins[rarity].forEach(skin => {
                allSkins[skin.id] = skin;
            });
        }
        return allSkins;
    }
    
    purchaseSkin(skinId) {
        const skin = this.getSkinById(skinId);
        if (!skin) return false;
        
        if (this.game.gameState.unlockedSkins.includes(skinId)) {
            return { success: false, message: 'Skin already unlocked!' };
        }
        
        if (this.game.gameState.coins < skin.price) {
            return { success: false, message: 'Not enough coins!' };
        }
        
        this.game.gameState.coins -= skin.price;
        this.game.gameState.unlockedSkins.push(skinId);
        
        return { success: true, message: `Unlocked ${skin.name}!` };
    }
    
    equipSkin(skinId) {
        if (!this.game.gameState.unlockedSkins.includes(skinId)) {
            return { success: false, message: 'Skin not unlocked!' };
        }
        
        this.game.gameState.currentSkin = skinId;
        return { success: true, message: 'Skin equipped!' };
    }
    
    checkSkinUnlocks() {
        // Check for level-based skin unlocks
        const level = this.game.gameState.level;
        
        for (const rarity in this.skins) {
            this.skins[rarity].forEach(skin => {
                if (skin.unlockLevel && level >= skin.unlockLevel) {
                    if (!this.game.gameState.unlockedSkins.includes(skin.id)) {
                        this.game.gameState.unlockedSkins.push(skin.id);
                        this.game.showNotification(`🔓 New skin unlocked: ${skin.name}!`, 'success');
                    }
                }
            });
        }
    }
    
    updateShopDisplay() {
        // This would update the shop UI
        console.log('Shop display updated');
    }
}