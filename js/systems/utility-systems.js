// Epic Clicker Tycoon RPG - Utility Systems

// Animation System
class AnimationSystem {
    constructor(game) {
        this.game = game;
        this.animations = [];
        this.animationId = 0;
    }
    
    async init() {
        console.log('🎬 Animation system initialized');
    }
    
    createAnimation(element, keyframes, duration, easing = 'ease') {
        const id = ++this.animationId;
        const animation = {
            id: id,
            element: element,
            keyframes: keyframes,
            duration: duration,
            easing: easing,
            startTime: Date.now(),
            isComplete: false
        };
        
        this.animations.push(animation);
        return id;
    }
    
    animate(element, properties, duration, easing = 'ease') {
        const startValues = {};
        const endValues = {};
        
        // Get current values
        for (const [property, value] of Object.entries(properties)) {
            startValues[property] = parseFloat(getComputedStyle(element)[property]) || 0;
            endValues[property] = value;
        }
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing
            const easedProgress = this.applyEasing(progress, easing);
            
            // Update properties
            for (const [property, startValue] of Object.entries(startValues)) {
                const endValue = endValues[property];
                const currentValue = startValue + (endValue - startValue) * easedProgress;
                element.style[property] = currentValue + (property.includes('color') ? '' : 'px');
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    applyEasing(progress, easing) {
        switch (easing) {
            case 'linear':
                return progress;
            case 'ease-in':
                return progress * progress;
            case 'ease-out':
                return 1 - (1 - progress) * (1 - progress);
            case 'ease-in-out':
                return progress < 0.5 ? 2 * progress * progress : 1 - 2 * (1 - progress) * (1 - progress);
            case 'bounce':
                return this.bounceEasing(progress);
            case 'elastic':
                return this.elasticEasing(progress);
            default:
                return progress;
        }
    }
    
    bounceEasing(progress) {
        if (progress < 1 / 2.75) {
            return 7.5625 * progress * progress;
        } else if (progress < 2 / 2.75) {
            return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75;
        } else if (progress < 2.5 / 2.75) {
            return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375;
        } else {
            return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375;
        }
    }
    
    elasticEasing(progress) {
        if (progress === 0) return 0;
        if (progress === 1) return 1;
        
        return Math.pow(2, -10 * progress) * Math.sin((progress - 0.075) * (2 * Math.PI) / 0.3) + 1;
    }
    
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        this.animate(element, { opacity: 1 }, duration);
    }
    
    fadeOut(element, duration = 300) {
        this.animate(element, { opacity: 0 }, duration, () => {
            element.style.display = 'none';
        });
    }
    
    slideIn(element, direction = 'left', duration = 300) {
        const startPosition = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
        const startY = direction === 'up' ? -100 : direction === 'down' ? 100 : 0;
        
        element.style.transform = `translate(${startPosition}px, ${startY}px)`;
        element.style.display = 'block';
        
        this.animate(element, { transform: 'translate(0px, 0px)' }, duration, 'ease-out');
    }
    
    slideOut(element, direction = 'left', duration = 300) {
        const endPosition = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
        const endY = direction === 'up' ? -100 : direction === 'down' ? 100 : 0;
        
        this.animate(element, { transform: `translate(${endPosition}px, ${endY}px)` }, duration, 'ease-in');
    }
    
    pulse(element, duration = 1000) {
        const originalScale = element.style.transform || 'scale(1)';
        
        this.animate(element, { transform: 'scale(1.1)' }, duration / 2, 'ease-out');
        setTimeout(() => {
            this.animate(element, { transform: originalScale }, duration / 2, 'ease-in');
        }, duration / 2);
    }
    
    shake(element, intensity = 10, duration = 500) {
        const originalTransform = element.style.transform;
        const shakes = 10;
        const shakeDuration = duration / shakes;
        
        for (let i = 0; i < shakes; i++) {
            setTimeout(() => {
                const x = (Math.random() - 0.5) * intensity * 2;
                const y = (Math.random() - 0.5) * intensity * 2;
                element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
            }, i * shakeDuration);
        }
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, duration);
    }
    
    update(deltaTime) {
        // Update animations
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const animation = this.animations[i];
            const elapsed = Date.now() - animation.startTime;
            
            if (elapsed >= animation.duration) {
                animation.isComplete = true;
                this.animations.splice(i, 1);
            }
        }
    }
}

// Helper System
class HelperSystem {
    constructor(game) {
        this.game = game;
    }
    
    async init() {
        console.log('🛠️ Helper system initialized');
    }
    
    formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        return (num / 1000000000000).toFixed(1) + 'T';
    }
    
    formatTime(seconds) {
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
    
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }
    
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Random System
class RandomSystem {
    constructor(game) {
        this.game = game;
        this.seed = Date.now();
        this.random = this.seededRandom();
    }
    
    async init() {
        console.log('🎲 Random system initialized');
    }
    
    seededRandom() {
        let seed = this.seed;
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
    
    setSeed(seed) {
        this.seed = seed;
        this.random = this.seededRandom();
    }
    
    random() {
        return this.random();
    }
    
    randomInt(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
    
    randomFloat(min, max) {
        return this.random() * (max - min) + min;
    }
    
    randomChoice(array) {
        return array[Math.floor(this.random() * array.length)];
    }
    
    randomWeightedChoice(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = this.random() * totalWeight;
        
        for (const item of items) {
            random -= item.weight;
            if (random <= 0) {
                return item.value;
            }
        }
        
        return items[items.length - 1].value;
    }
    
    randomBool(probability = 0.5) {
        return this.random() < probability;
    }
    
    randomColor() {
        const hue = this.random() * 360;
        const saturation = this.random() * 50 + 50;
        const lightness = this.random() * 30 + 40;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    
    randomGradient() {
        const color1 = this.randomColor();
        const color2 = this.randomColor();
        const angle = this.random() * 360;
        return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    
    randomName() {
        const prefixes = ['Epic', 'Mighty', 'Ancient', 'Cosmic', 'Mystic', 'Legendary', 'Divine', 'Infernal'];
        const suffixes = ['Dragon', 'Phoenix', 'Warrior', 'Mage', 'Knight', 'Wizard', 'Lord', 'King'];
        
        return `${this.randomChoice(prefixes)} ${this.randomChoice(suffixes)}`;
    }
    
    randomLootTable(lootTable) {
        const results = [];
        
        for (const item of lootTable) {
            if (this.random() < item.chance) {
                const quantity = this.randomInt(item.minQuantity || 1, item.maxQuantity || 1);
                results.push({
                    item: item.item,
                    quantity: quantity
                });
            }
        }
        
        return results;
    }
    
    randomEvent(events) {
        const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
        let random = this.random() * totalWeight;
        
        for (const event of events) {
            random -= event.weight;
            if (random <= 0) {
                return event;
            }
        }
        
        return events[events.length - 1];
    }
    
    randomPosition(minX, maxX, minY, maxY) {
        return {
            x: this.randomFloat(minX, maxX),
            y: this.randomFloat(minY, maxY)
        };
    }
    
    randomVelocity(minSpeed, maxSpeed) {
        const speed = this.randomFloat(minSpeed, maxSpeed);
        const angle = this.random() * Math.PI * 2;
        
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }
}

// Effect System
class EffectSystem {
    constructor(game) {
        this.game = game;
        this.effects = [];
        this.effectId = 0;
    }
    
    async init() {
        console.log('✨ Effect system initialized');
    }
    
    createEffect(type, target, duration, properties = {}) {
        const id = ++this.effectId;
        const effect = {
            id: id,
            type: type,
            target: target,
            duration: duration,
            properties: properties,
            startTime: Date.now(),
            isActive: true
        };
        
        this.effects.push(effect);
        this.applyEffect(effect);
        
        return id;
    }
    
    applyEffect(effect) {
        switch (effect.type) {
            case 'glow':
                this.applyGlowEffect(effect);
                break;
            case 'shake':
                this.applyShakeEffect(effect);
                break;
            case 'scale':
                this.applyScaleEffect(effect);
                break;
            case 'color':
                this.applyColorEffect(effect);
                break;
            case 'rotation':
                this.applyRotationEffect(effect);
                break;
            case 'fade':
                this.applyFadeEffect(effect);
                break;
        }
    }
    
    applyGlowEffect(effect) {
        const element = effect.target;
        const color = effect.properties.color || '#ffff00';
        const intensity = effect.properties.intensity || 10;
        
        element.style.boxShadow = `0 0 ${intensity}px ${color}`;
        element.style.filter = `drop-shadow(0 0 ${intensity}px ${color})`;
    }
    
    applyShakeEffect(effect) {
        const element = effect.target;
        const intensity = effect.properties.intensity || 5;
        const frequency = effect.properties.frequency || 10;
        
        const shake = () => {
            const x = (Math.random() - 0.5) * intensity * 2;
            const y = (Math.random() - 0.5) * intensity * 2;
            element.style.transform = `translate(${x}px, ${y}px)`;
        };
        
        const interval = setInterval(shake, 1000 / frequency);
        
        setTimeout(() => {
            clearInterval(interval);
            element.style.transform = '';
        }, effect.duration);
    }
    
    applyScaleEffect(effect) {
        const element = effect.target;
        const scale = effect.properties.scale || 1.2;
        const duration = effect.duration;
        
        this.game.systems.animations.animate(element, { transform: `scale(${scale})` }, duration / 2, 'ease-out');
        setTimeout(() => {
            this.game.systems.animations.animate(element, { transform: 'scale(1)' }, duration / 2, 'ease-in');
        }, duration / 2);
    }
    
    applyColorEffect(effect) {
        const element = effect.target;
        const color = effect.properties.color || '#ff0000';
        const duration = effect.duration;
        
        const originalColor = element.style.color;
        this.game.systems.animations.animate(element, { color: color }, duration / 2, 'ease-out');
        setTimeout(() => {
            this.game.systems.animations.animate(element, { color: originalColor }, duration / 2, 'ease-in');
        }, duration / 2);
    }
    
    applyRotationEffect(effect) {
        const element = effect.target;
        const rotation = effect.properties.rotation || 360;
        const duration = effect.duration;
        
        const originalTransform = element.style.transform;
        this.game.systems.animations.animate(element, { transform: `${originalTransform} rotate(${rotation}deg)` }, duration, 'ease-in-out');
    }
    
    applyFadeEffect(effect) {
        const element = effect.target;
        const opacity = effect.properties.opacity || 0.5;
        const duration = effect.duration;
        
        const originalOpacity = element.style.opacity;
        this.game.systems.animations.animate(element, { opacity: opacity }, duration / 2, 'ease-out');
        setTimeout(() => {
            this.game.systems.animations.animate(element, { opacity: originalOpacity }, duration / 2, 'ease-in');
        }, duration / 2);
    }
    
    removeEffect(effectId) {
        const effect = this.effects.find(e => e.id === effectId);
        if (effect) {
            effect.isActive = false;
            this.removeEffectFromElement(effect);
            this.effects = this.effects.filter(e => e.id !== effectId);
        }
    }
    
    removeEffectFromElement(effect) {
        const element = effect.target;
        
        switch (effect.type) {
            case 'glow':
                element.style.boxShadow = '';
                element.style.filter = '';
                break;
            case 'shake':
                element.style.transform = '';
                break;
            case 'scale':
                element.style.transform = '';
                break;
            case 'color':
                element.style.color = '';
                break;
            case 'rotation':
                element.style.transform = '';
                break;
            case 'fade':
                element.style.opacity = '';
                break;
        }
    }
    
    clearAllEffects() {
        this.effects.forEach(effect => {
            this.removeEffectFromElement(effect);
        });
        this.effects = [];
    }
    
    getActiveEffects() {
        return this.effects.filter(effect => effect.isActive);
    }
    
    update(deltaTime) {
        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            const elapsed = Date.now() - effect.startTime;
            
            if (elapsed >= effect.duration) {
                this.removeEffect(effect.id);
            }
        }
    }
}