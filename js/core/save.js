// Save System Module
class SaveSystem {
    constructor() {
        this.saveKey = 'epicClickerSave';
        this.backupKey = 'epicClickerBackup';
        this.autoSaveInterval = 30000; // 30 seconds
        this.backupInterval = 300000; // 5 minutes
    }

    init(game) {
        this.game = game;
        this.startAutoSave();
        this.startBackupSystem();
    }

    saveGame() {
        try {
            const saveData = {
                state: this.game.state,
                version: '1.0.0',
                timestamp: Date.now(),
                checksum: this.generateChecksum(this.game.state)
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            
            // Create backup every 5 minutes
            if (Date.now() - this.lastBackup > this.backupInterval) {
                this.createBackup(saveData);
            }
            
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    }

    loadGame() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) return false;
            
            const parsed = JSON.parse(saveData);
            
            // Validate save data
            if (!this.validateSaveData(parsed)) {
                console.warn('Save data corrupted, trying backup...');
                return this.loadBackup();
            }
            
            // Apply save data
            this.game.state = { ...this.game.state, ...parsed.state };
            
            // Handle version migrations
            this.migrateSaveData(parsed.version);
            
            return true;
        } catch (error) {
            console.error('Load failed:', error);
            return this.loadBackup();
        }
    }

    createBackup(saveData) {
        try {
            localStorage.setItem(this.backupKey, JSON.stringify(saveData));
            this.lastBackup = Date.now();
        } catch (error) {
            console.error('Backup creation failed:', error);
        }
    }

    loadBackup() {
        try {
            const backupData = localStorage.getItem(this.backupKey);
            if (!backupData) return false;
            
            const parsed = JSON.parse(backupData);
            if (this.validateSaveData(parsed)) {
                this.game.state = { ...this.game.state, ...parsed.state };
                return true;
            }
        } catch (error) {
            console.error('Backup load failed:', error);
        }
        return false;
    }

    validateSaveData(saveData) {
        if (!saveData || !saveData.state || !saveData.checksum) {
            return false;
        }
        
        const expectedChecksum = this.generateChecksum(saveData.state);
        return saveData.checksum === expectedChecksum;
    }

    generateChecksum(data) {
        // Simple checksum for data integrity
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    migrateSaveData(version) {
        // Handle save data migrations between versions
        if (version === '1.0.0') {
            // Add new fields if they don't exist
            if (!this.game.state.stats) {
                this.game.state.stats = {
                    totalCoinsEarned: 0,
                    totalDiamondsEarned: 0,
                    totalBossesDefeated: 0,
                    totalPrestiges: 0,
                    playTime: 0,
                    totalDamageDealt: 0,
                    criticalHits: 0,
                    luckyClicks: 0
                };
            }
            
            if (!this.game.state.inventory) {
                this.game.state.inventory = {
                    skins: [],
                    items: [],
                    chests: []
                };
            }
            
            if (!this.game.state.events) {
                this.game.state.events = {
                    activeEvents: [],
                    eventHistory: []
                };
            }
        }
    }

    exportSave() {
        try {
            const saveData = {
                state: this.game.state,
                version: '1.0.0',
                timestamp: Date.now(),
                checksum: this.generateChecksum(this.game.state)
            };
            
            const dataStr = JSON.stringify(saveData);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `epic-clicker-save-${Date.now()}.json`;
            link.click();
            
            return true;
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    }

    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    if (!this.validateSaveData(saveData)) {
                        reject(new Error('Invalid save file'));
                        return;
                    }
                    
                    // Apply imported save data
                    this.game.state = { ...this.game.state, ...saveData.state };
                    this.migrateSaveData(saveData.version);
                    
                    // Save the imported data
                    this.saveGame();
                    
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsText(file);
        });
    }

    clearSave() {
        try {
            localStorage.removeItem(this.saveKey);
            localStorage.removeItem(this.backupKey);
            return true;
        } catch (error) {
            console.error('Clear save failed:', error);
            return false;
        }
    }

    getSaveInfo() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) return null;
            
            const parsed = JSON.parse(saveData);
            return {
                version: parsed.version,
                timestamp: parsed.timestamp,
                date: new Date(parsed.timestamp).toLocaleString(),
                size: saveData.length
            };
        } catch (error) {
            console.error('Get save info failed:', error);
            return null;
        }
    }

    startAutoSave() {
        setInterval(() => {
            this.saveGame();
        }, this.autoSaveInterval);
    }

    startBackupSystem() {
        this.lastBackup = Date.now();
    }

    // Cloud save simulation (for future implementation)
    cloudSave() {
        // This would integrate with a cloud service
        console.log('Cloud save not implemented yet');
        return false;
    }

    cloudLoad() {
        // This would integrate with a cloud service
        console.log('Cloud load not implemented yet');
        return false;
    }
}

// Global save system instance
window.SaveSystem = SaveSystem;