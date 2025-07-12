// Audio System Module
class AudioSystem {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.volume = {
            master: 0.5,
            sfx: 0.3,
            music: 0.2
        };
        this.enabled = {
            sound: true,
            music: true
        };
    }

    init(game) {
        this.game = game;
        this.loadSounds();
        this.loadMusic();
        this.setupAudioContext();
    }

    setupAudioContext() {
        // Create audio context for better sound management
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported');
        }
    }

    loadSounds() {
        // Preload common sound effects
        this.sounds = {
            click: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            upgrade: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            achievement: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            bossDefeat: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            levelUp: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            prestige: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            error: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            notification: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
        };
    }

    loadMusic() {
        // Background music tracks
        this.music = {
            main: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            boss: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            victory: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
        };

        // Set music properties
        Object.values(this.music).forEach(track => {
            track.loop = true;
            track.volume = this.volume.music;
        });
    }

    createAudio(src) {
        const audio = new Audio(src);
        audio.volume = this.volume.sfx;
        return audio;
    }

    playSound(soundName) {
        if (!this.enabled.sound || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = this.volume.sfx * this.volume.master;
            sound.play().catch(() => {});
        } catch (error) {
            console.warn('Sound play failed:', error);
        }
    }

    playMusic(musicName) {
        if (!this.enabled.music || !this.music[musicName]) return;
        
        try {
            // Stop current music
            if (this.currentMusic) {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            }
            
            this.currentMusic = this.music[musicName];
            this.currentMusic.volume = this.volume.music * this.volume.master;
            this.currentMusic.play().catch(() => {});
        } catch (error) {
            console.warn('Music play failed:', error);
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    setVolume(type, value) {
        this.volume[type] = Math.max(0, Math.min(1, value));
        
        // Update current music volume
        if (this.currentMusic) {
            this.currentMusic.volume = this.volume.music * this.volume.master;
        }
        
        // Update sound volumes
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume.sfx * this.volume.master;
        });
    }

    toggleSound() {
        this.enabled.sound = !this.enabled.sound;
        return this.enabled.sound;
    }

    toggleMusic() {
        this.enabled.music = !this.enabled.music;
        
        if (!this.enabled.music) {
            this.stopMusic();
        } else if (this.currentMusic) {
            this.currentMusic.play().catch(() => {});
        }
        
        return this.enabled.music;
    }

    // Sound effects for different actions
    playClickSound() {
        this.playSound('click');
    }

    playUpgradeSound() {
        this.playSound('upgrade');
    }

    playAchievementSound() {
        this.playSound('achievement');
    }

    playBossDefeatSound() {
        this.playSound('bossDefeat');
    }

    playLevelUpSound() {
        this.playSound('levelUp');
    }

    playPrestigeSound() {
        this.playSound('prestige');
    }

    playErrorSound() {
        this.playSound('error');
    }

    playNotificationSound() {
        this.playSound('notification');
    }

    // Music for different game states
    playMainMusic() {
        this.playMusic('main');
    }

    playBossMusic() {
        this.playMusic('boss');
    }

    playVictoryMusic() {
        this.playMusic('victory');
    }

    // Dynamic sound generation for different skins
    generateSkinSound(skinId) {
        // Generate different click sounds based on skin
        const skinSounds = {
            dragon_basic: 'click',
            dragon_fire: 'click',
            dragon_ancient: 'click',
            dragon_god: 'click'
        };
        
        return skinSounds[skinId] || 'click';
    }

    // Ambient sounds
    playAmbientSound(type) {
        const ambientSounds = {
            rain: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            wind: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            fire: this.createAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
        };
        
        const sound = ambientSounds[type];
        if (sound) {
            sound.loop = true;
            sound.volume = this.volume.sfx * this.volume.master * 0.3;
            sound.play().catch(() => {});
            return sound;
        }
    }

    // Audio visualization (for future implementation)
    startVisualization() {
        if (!this.audioContext) return;
        
        // This would create audio visualizations
        console.log('Audio visualization not implemented yet');
    }

    // Spatial audio (for future implementation)
    setSpatialAudio(x, y) {
        // This would implement 3D spatial audio
        console.log('Spatial audio not implemented yet');
    }

    // Audio effects and filters
    applyFilter(type) {
        if (!this.audioContext) return;
        
        const filters = {
            lowpass: this.audioContext.createBiquadFilter(),
            highpass: this.audioContext.createBiquadFilter(),
            distortion: this.audioContext.createWaveShaper()
        };
        
        // Apply filter effects
        console.log('Audio filters not implemented yet');
    }

    // Export audio settings
    exportSettings() {
        return {
            volume: this.volume,
            enabled: this.enabled
        };
    }

    // Import audio settings
    importSettings(settings) {
        if (settings.volume) {
            this.volume = { ...this.volume, ...settings.volume };
        }
        if (settings.enabled) {
            this.enabled = { ...this.enabled, ...settings.enabled };
        }
    }
}

// Global audio system instance
window.AudioSystem = AudioSystem;