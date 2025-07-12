// Epic Clicker Tycoon RPG - Save System

class SaveSystem {
    constructor(game) {
        this.game = game;
        this.saveKey = 'epicClickerSave';
        this.backupKey = 'epicClickerBackup';
        this.version = '2.1.0';
    }
    
    async init() {
        console.log('💾 Save system initialized');
    }
    
    async saveGame(gameState) {
        try {
            // Add metadata to save data
            const saveData = {
                version: this.version,
                timestamp: Date.now(),
                data: gameState
            };
            
            // Compress save data
            const compressedData = await this.compressData(saveData);
            
            // Save to localStorage
            localStorage.setItem(this.saveKey, compressedData);
            
            // Create backup every 10 saves
            const saveCount = parseInt(localStorage.getItem('epicClickerSaveCount') || '0') + 1;
            localStorage.setItem('epicClickerSaveCount', saveCount.toString());
            
            if (saveCount % 10 === 0) {
                localStorage.setItem(this.backupKey, compressedData);
            }
            
            console.log('💾 Game saved successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to save game:', error);
            return false;
        }
    }
    
    async loadGame() {
        try {
            // Try to load from main save
            let saveData = localStorage.getItem(this.saveKey);
            
            if (!saveData) {
                // Try to load from backup
                saveData = localStorage.getItem(this.backupKey);
                if (saveData) {
                    console.log('⚠️ Loading from backup save');
                }
            }
            
            if (!saveData) {
                console.log('📝 No save data found, starting new game');
                return null;
            }
            
            // Decompress save data
            const decompressedData = await this.decompressData(saveData);
            
            // Check version compatibility
            if (decompressedData.version !== this.version) {
                console.log('⚠️ Save version mismatch, attempting migration');
                const migratedData = this.migrateSaveData(decompressedData);
                return migratedData.data;
            }
            
            console.log('💾 Game loaded successfully');
            return decompressedData.data;
            
        } catch (error) {
            console.error('❌ Failed to load game:', error);
            
            // Try to load backup
            try {
                const backupData = localStorage.getItem(this.backupKey);
                if (backupData) {
                    console.log('🔄 Attempting to load from backup...');
                    const decompressedBackup = await this.decompressData(backupData);
                    return decompressedBackup.data;
                }
            } catch (backupError) {
                console.error('❌ Failed to load backup:', backupError);
            }
            
            return null;
        }
    }
    
    async compressData(data) {
        // Simple compression using JSON stringification
        // In a real implementation, you might use a more sophisticated compression algorithm
        return JSON.stringify(data);
    }
    
    async decompressData(compressedData) {
        // Simple decompression
        return JSON.parse(compressedData);
    }
    
    migrateSaveData(oldSaveData) {
        // Handle save data migration between versions
        const currentVersion = this.version;
        const oldVersion = oldSaveData.version;
        
        console.log(`🔄 Migrating save from version ${oldVersion} to ${currentVersion}`);
        
        let migratedData = oldSaveData.data;
        
        // Version 1.0.0 to 2.0.0 migration
        if (oldVersion === '1.0.0' && currentVersion === '2.0.0') {
            migratedData = this.migrateFromV1ToV2(migratedData);
        }
        
        // Version 2.0.0 to 2.1.0 migration
        if (oldVersion === '2.0.0' && currentVersion === '2.1.0') {
            migratedData = this.migrateFromV2ToV2_1(migratedData);
        }
        
        return {
            version: currentVersion,
            timestamp: Date.now(),
            data: migratedData
        };
    }
    
    migrateFromV1ToV2(oldData) {
        // Add new fields that didn't exist in v1
        const newData = {
            ...oldData,
            prestigeCount: oldData.prestigeCount || 0,
            prestigeMultiplier: oldData.prestigeMultiplier || 1,
            minigamesPlayed: oldData.minigamesPlayed || 0,
            minigameScores: oldData.minigameScores || {},
            dailyStreak: oldData.dailyStreak || 0,
            lastDailyClaim: oldData.lastDailyClaim || null
        };
        
        return newData;
    }
    
    migrateFromV2ToV2_1(oldData) {
        // Add new statistics tracking
        const newData = {
            ...oldData,
            stats: {
                ...oldData.stats,
                fastestClick: oldData.stats?.fastestClick || 0,
                longestSession: oldData.stats?.longestSession || 0,
                mostCoinsInSession: oldData.stats?.mostCoinsInSession || 0
            }
        };
        
        return newData;
    }
    
    exportSaveData() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) {
                throw new Error('No save data found');
            }
            
            const decompressedData = JSON.parse(saveData);
            return JSON.stringify(decompressedData, null, 2);
            
        } catch (error) {
            console.error('❌ Failed to export save data:', error);
            return null;
        }
    }
    
    importSaveData(saveDataString) {
        try {
            const saveData = JSON.parse(saveDataString);
            
            // Validate save data structure
            if (!saveData.data || !saveData.version) {
                throw new Error('Invalid save data format');
            }
            
            // Compress and save
            const compressedData = JSON.stringify(saveData);
            localStorage.setItem(this.saveKey, compressedData);
            
            console.log('💾 Save data imported successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to import save data:', error);
            return false;
        }
    }
    
    clearSaveData() {
        try {
            localStorage.removeItem(this.saveKey);
            localStorage.removeItem(this.backupKey);
            localStorage.removeItem('epicClickerSaveCount');
            console.log('🗑️ Save data cleared');
            return true;
        } catch (error) {
            console.error('❌ Failed to clear save data:', error);
            return false;
        }
    }
    
    getSaveInfo() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) {
                return null;
            }
            
            const decompressedData = JSON.parse(saveData);
            return {
                version: decompressedData.version,
                timestamp: decompressedData.timestamp,
                lastSave: new Date(decompressedData.timestamp).toLocaleString(),
                playerLevel: decompressedData.data.level,
                totalClicks: decompressedData.data.totalClicks,
                totalCoins: decompressedData.data.coins,
                totalDiamonds: decompressedData.data.diamonds
            };
            
        } catch (error) {
            console.error('❌ Failed to get save info:', error);
            return null;
        }
    }
    
    createBackup() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                localStorage.setItem(this.backupKey, saveData);
                console.log('💾 Backup created successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Failed to create backup:', error);
            return false;
        }
    }
    
    restoreBackup() {
        try {
            const backupData = localStorage.getItem(this.backupKey);
            if (backupData) {
                localStorage.setItem(this.saveKey, backupData);
                console.log('🔄 Backup restored successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Failed to restore backup:', error);
            return false;
        }
    }
    
    getSaveSize() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                return {
                    bytes: saveData.length,
                    kilobytes: (saveData.length / 1024).toFixed(2)
                };
            }
            return { bytes: 0, kilobytes: '0.00' };
        } catch (error) {
            console.error('❌ Failed to get save size:', error);
            return { bytes: 0, kilobytes: '0.00' };
        }
    }
    
    validateSaveData(saveData) {
        try {
            // Check if save data has required fields
            const requiredFields = [
                'level', 'xp', 'coins', 'diamonds', 'score',
                'clickPower', 'totalClicks', 'upgrades', 'skins'
            ];
            
            for (const field of requiredFields) {
                if (!(field in saveData)) {
                    return { valid: false, error: `Missing required field: ${field}` };
                }
            }
            
            // Check for reasonable values
            if (saveData.level < 1) {
                return { valid: false, error: 'Invalid level value' };
            }
            
            if (saveData.coins < 0 || saveData.diamonds < 0) {
                return { valid: false, error: 'Invalid currency values' };
            }
            
            return { valid: true };
            
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
    
    autoSave() {
        // This method is called periodically to ensure data is saved
        if (this.game && this.game.gameState) {
            this.saveGame(this.game.gameState);
        }
    }
    
    // Cloud save functionality (placeholder for future implementation)
    async saveToCloud() {
        // This would integrate with a cloud service like Firebase
        console.log('☁️ Cloud save not implemented yet');
        return false;
    }
    
    async loadFromCloud() {
        // This would integrate with a cloud service like Firebase
        console.log('☁️ Cloud load not implemented yet');
        return null;
    }
}