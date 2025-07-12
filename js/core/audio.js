// Epic Clicker Tycoon RPG - Audio System

class AudioSystem {
    constructor(game) {
        this.game = game;
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.75;
        this.isMuted = false;
        this.currentMusic = null;
        
        // Audio context for better sound management
        this.audioContext = null;
        this.initAudioContext();
    }
    
    async init() {
        console.log('🎵 Audio system initialized');
        this.loadSounds();
        this.setupAudioElements();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported, using fallback audio');
        }
    }
    
    loadSounds() {
        // Define sound effects
        this.sounds = {
            click: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.3 },
            critical: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.5 },
            powerful: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.4 },
            levelUp: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.6 },
            achievement: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.7 },
            boss: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.8 },
            coin: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.2 },
            diamond: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.4 },
            notification: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.3 }
        };
        
        // Skin-specific sounds
        this.skinSounds = {
            dragon_roar: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.5 },
            phoenix_cry: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.6 },
            thunder_clap: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.7 },
            crystal_tinkle: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.3 },
            wolf_howl: { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT', volume: 0.5 }
        };
    }
    
    setupAudioElements() {
        // Set up background music
        this.backgroundMusic = document.getElementById('backgroundMusic');
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.loop = true;
        }
        
        // Set up sound effect elements
        this.clickSound = document.getElementById('clickSound');
        this.achievementSound = document.getElementById('achievementSound');
        this.levelUpSound = document.getElementById('levelUpSound');
        this.bossSound = document.getElementById('bossSound');
        
        if (this.clickSound) this.clickSound.volume = this.sfxVolume;
        if (this.achievementSound) this.achievementSound.volume = this.sfxVolume;
        if (this.levelUpSound) this.levelUpSound.volume = this.sfxVolume;
        if (this.bossSound) this.bossSound.volume = this.sfxVolume;
    }
    
    playSound(soundName) {
        if (this.isMuted) return;
        
        try {
            let sound = this.sounds[soundName];
            
            // Check if it's a skin-specific sound
            if (!sound) {
                sound = this.skinSounds[soundName];
            }
            
            if (sound) {
                this.playSoundFromData(sound);
            } else {
                // Fallback to default click sound
                this.playSoundFromData(this.sounds.click);
            }
        } catch (error) {
            console.warn('Failed to play sound:', soundName, error);
        }
    }
    
    playSoundFromData(soundData) {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Create audio element for this sound
        const audio = new Audio(soundData.src);
        audio.volume = (soundData.volume || 0.5) * this.sfxVolume;
        
        // Play the sound
        audio.play().catch(error => {
            console.warn('Failed to play audio:', error);
        });
        
        // Clean up after playing
        audio.addEventListener('ended', () => {
            audio.remove();
        });
    }
    
    playMusic(musicName) {
        if (this.isMuted) return;
        
        try {
            if (this.backgroundMusic) {
                // For now, we'll use a simple approach
                // In a full implementation, you'd load different music tracks
                this.backgroundMusic.play().catch(error => {
                    console.warn('Failed to play background music:', error);
                });
            }
        } catch (error) {
            console.warn('Failed to play music:', musicName, error);
        }
    }
    
    stopMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume / 100));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume / 100));
        
        // Update existing audio elements
        if (this.clickSound) this.clickSound.volume = this.sfxVolume;
        if (this.achievementSound) this.achievementSound.volume = this.sfxVolume;
        if (this.levelUpSound) this.levelUpSound.volume = this.sfxVolume;
        if (this.bossSound) this.bossSound.volume = this.sfxVolume;
    }
    
    mute() {
        this.isMuted = true;
        this.stopMusic();
    }
    
    unmute() {
        this.isMuted = false;
        if (this.backgroundMusic) {
            this.backgroundMusic.play().catch(() => {});
        }
    }
    
    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }
    
    // Generate simple sound effects using Web Audio API
    generateClickSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    generateCriticalSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.5 * this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    generateLevelUpSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.6 * this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    generateAchievementSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.7 * this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    // Enhanced sound playing with generated sounds
    playEnhancedSound(soundName) {
        if (this.isMuted) return;
        
        switch (soundName) {
            case 'click':
                this.generateClickSound();
                break;
            case 'critical':
                this.generateCriticalSound();
                break;
            case 'levelUp':
                this.generateLevelUpSound();
                break;
            case 'achievement':
                this.generateAchievementSound();
                break;
            default:
                this.playSound(soundName);
        }
    }
    
    // Preload sounds for better performance
    preloadSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            const audio = new Audio();
            audio.src = this.sounds[soundName].src;
            audio.load();
        });
        
        Object.keys(this.skinSounds).forEach(soundName => {
            const audio = new Audio();
            audio.src = this.skinSounds[soundName].src;
            audio.load();
        });
    }
    
    // Get audio statistics
    getAudioStats() {
        return {
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            isMuted: this.isMuted,
            soundsLoaded: Object.keys(this.sounds).length,
            skinSoundsLoaded: Object.keys(this.skinSounds).length,
            audioContextState: this.audioContext ? this.audioContext.state : 'not supported'
        };
    }
}