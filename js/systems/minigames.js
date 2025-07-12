// Epic Clicker Tycoon RPG - Minigame System

class MinigameSystem {
    constructor(game) {
        this.game = game;
        this.minigames = {};
        this.currentGame = null;
        this.gameState = null;
        this.gameTimer = 0;
        this.gameDuration = 30000; // 30 seconds
        this.isGameActive = false;
        this.highScores = {};
    }
    
    async init() {
        console.log('🎮 Minigame system initialized');
        await this.loadMinigames();
        this.setupEventListeners();
        this.loadHighScores();
    }
    
    async loadMinigames() {
        try {
            const response = await fetch('config/minigames.json');
            const data = await response.json();
            this.minigames = data.minigames;
            console.log('🎮 Minigames loaded successfully');
        } catch (error) {
            console.warn('Failed to load minigames config, using defaults');
            this.createDefaultMinigames();
        }
    }
    
    createDefaultMinigames() {
        this.minigames = {
            "flappy_clicker": {
                "id": "flappy_clicker",
                "name": "Flappy Clicker",
                "description": "Click to make the bird flap and avoid obstacles",
                "icon": "🦅",
                "difficulties": ["easy", "medium", "hard", "extreme"],
                "rewards": {
                    "easy": {"coins": 100, "xp": 50, "diamonds": 1},
                    "medium": {"coins": 250, "xp": 100, "diamonds": 2},
                    "hard": {"coins": 500, "xp": 200, "diamonds": 5},
                    "extreme": {"coins": 1000, "xp": 500, "diamonds": 10}
                }
            },
            "memory_match": {
                "id": "memory_match",
                "name": "Memory Match",
                "description": "Find matching pairs of cards",
                "icon": "🧠",
                "difficulties": ["easy", "medium", "hard"],
                "rewards": {
                    "easy": {"coins": 150, "xp": 75, "diamonds": 1},
                    "medium": {"coins": 300, "xp": 150, "diamonds": 3},
                    "hard": {"coins": 600, "xp": 300, "diamonds": 6}
                }
            },
            "reaction_timer": {
                "id": "reaction_timer",
                "name": "Reaction Timer",
                "description": "Click as fast as possible when the color changes",
                "icon": "⚡",
                "difficulties": ["easy", "medium", "hard", "extreme"],
                "rewards": {
                    "easy": {"coins": 80, "xp": 40, "diamonds": 1},
                    "medium": {"coins": 200, "xp": 80, "diamonds": 2},
                    "hard": {"coins": 400, "xp": 160, "diamonds": 4},
                    "extreme": {"coins": 800, "xp": 320, "diamonds": 8}
                }
            },
            "math_quiz": {
                "id": "math_quiz",
                "name": "Math Quiz",
                "description": "Solve math problems quickly",
                "icon": "🔢",
                "difficulties": ["easy", "medium", "hard"],
                "rewards": {
                    "easy": {"coins": 120, "xp": 60, "diamonds": 1},
                    "medium": {"coins": 240, "xp": 120, "diamonds": 2},
                    "hard": {"coins": 480, "xp": 240, "diamonds": 4}
                }
            },
            "dungeon_crawler": {
                "id": "dungeon_crawler",
                "name": "Dungeon Crawler",
                "description": "Navigate through a dungeon and collect treasures",
                "icon": "🏰",
                "difficulties": ["easy", "medium", "hard"],
                "rewards": {
                    "easy": {"coins": 200, "xp": 100, "diamonds": 2},
                    "medium": {"coins": 400, "xp": 200, "diamonds": 4},
                    "hard": {"coins": 800, "xp": 400, "diamonds": 8}
                }
            }
        };
    }
    
    setupEventListeners() {
        // Minigame selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('minigame-btn')) {
                const gameId = e.target.dataset.game;
                this.showMinigameMenu(gameId);
            }
            
            if (e.target.classList.contains('difficulty-btn')) {
                const difficulty = e.target.dataset.difficulty;
                this.startMinigame(this.currentGame, difficulty);
            }
        });
    }
    
    showMinigameMenu(gameId) {
        const minigame = this.minigames[gameId];
        if (!minigame) return;
        
        this.currentGame = gameId;
        
        const modalData = {
            title: `${minigame.icon} ${minigame.name}`,
            content: `
                <div class="minigame-menu">
                    <p class="minigame-description">${minigame.description}</p>
                    <div class="difficulty-selection">
                        <h4>Select Difficulty:</h4>
                        <div class="difficulty-buttons">
                            ${minigame.difficulties.map(difficulty => `
                                <button class="difficulty-btn" data-difficulty="${difficulty}">
                                    ${this.getDifficultyIcon(difficulty)} ${difficulty.toUpperCase()}
                                    <div class="difficulty-rewards">
                                        💰 ${minigame.rewards[difficulty].coins} | 
                                        ⭐ ${minigame.rewards[difficulty].xp} | 
                                        💎 ${minigame.rewards[difficulty].diamonds}
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="high-score">
                        <h4>High Score:</h4>
                        <div>${this.getHighScore(gameId) || 'No score yet'}</div>
                    </div>
                </div>
            `,
            buttons: ['Cancel']
        };
        
        this.game.systems.modals.show(modalData);
    }
    
    getDifficultyIcon(difficulty) {
        const icons = {
            'easy': '🟢',
            'medium': '🟡',
            'hard': '🟠',
            'extreme': '🔴'
        };
        return icons[difficulty] || '⚪';
    }
    
    startMinigame(gameId, difficulty) {
        const minigame = this.minigames[gameId];
        if (!minigame) return;
        
        this.currentGame = gameId;
        this.gameState = {
            gameId: gameId,
            difficulty: difficulty,
            score: 0,
            startTime: Date.now(),
            endTime: null
        };
        
        this.isGameActive = true;
        this.gameTimer = 0;
        
        // Hide modal
        this.game.systems.modals.hide();
        
        // Start the specific minigame
        switch (gameId) {
            case 'flappy_clicker':
                this.startFlappyClicker(difficulty);
                break;
            case 'memory_match':
                this.startMemoryMatch(difficulty);
                break;
            case 'reaction_timer':
                this.startReactionTimer(difficulty);
                break;
            case 'math_quiz':
                this.startMathQuiz(difficulty);
                break;
            case 'dungeon_crawler':
                this.startDungeonCrawler(difficulty);
                break;
        }
        
        this.game.showNotification(`🎮 Starting ${minigame.name} (${difficulty})!`, 'info');
    }
    
    startFlappyClicker(difficulty) {
        const container = document.getElementById('minigameArea');
        if (!container) return;
        
        const speed = this.getDifficultySpeed(difficulty);
        
        container.innerHTML = `
            <div class="flappy-clicker-game">
                <div class="game-header">
                    <div class="game-score">Score: <span id="gameScore">0</span></div>
                    <div class="game-time">Time: <span id="gameTime">30</span>s</div>
                </div>
                <div class="game-area" id="flappyGameArea">
                    <div class="bird" id="flappyBird">🦅</div>
                    <div class="obstacles" id="obstacles"></div>
                </div>
                <div class="game-instructions">
                    Click or press Space to make the bird flap!
                </div>
            </div>
        `;
        
        // Game logic
        const bird = document.getElementById('flappyBird');
        const obstacles = document.getElementById('obstacles');
        let birdY = 200;
        let birdVelocity = 0;
        let obstacleX = 800;
        let obstacleGap = 150;
        let score = 0;
        
        const gameLoop = () => {
            if (!this.isGameActive) return;
            
            // Update bird
            birdVelocity += 0.5;
            birdY += birdVelocity;
            bird.style.top = birdY + 'px';
            
            // Update obstacles
            obstacleX -= speed;
            obstacles.style.left = obstacleX + 'px';
            
            // Check collision
            if (this.checkFlappyCollision(birdY, obstacleX)) {
                this.endMinigame(score);
                return;
            }
            
            // Check score
            if (obstacleX < 50 && obstacleX > 30) {
                score++;
                document.getElementById('gameScore').textContent = score;
            }
            
            // Create new obstacles
            if (obstacleX < -100) {
                obstacleX = 800;
                obstacleGap = 150 + Math.random() * 100;
                this.createFlappyObstacles(obstacles, obstacleGap);
            }
            
            requestAnimationFrame(gameLoop);
        };
        
        // Controls
        const flap = () => {
            if (this.isGameActive) {
                birdVelocity = -8;
                this.game.systems.audio.playSound('click');
            }
        };
        
        document.addEventListener('click', flap);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                flap();
            }
        });
        
        // Start game
        this.createFlappyObstacles(obstacles, obstacleGap);
        gameLoop();
        
        // Game timer
        this.startGameTimer();
    }
    
    checkFlappyCollision(birdY, obstacleX) {
        return birdY < 0 || birdY > 400 || (obstacleX < 100 && obstacleX > 50);
    }
    
    createFlappyObstacles(container, gap) {
        container.innerHTML = `
            <div class="obstacle top" style="height: ${200 - gap/2}px"></div>
            <div class="obstacle bottom" style="top: ${200 + gap/2}px; height: ${200 - gap/2}px"></div>
        `;
    }
    
    startMemoryMatch(difficulty) {
        const container = document.getElementById('minigameArea');
        if (!container) return;
        
        const cardCount = this.getDifficultyCardCount(difficulty);
        const cards = this.generateMemoryCards(cardCount);
        
        container.innerHTML = `
            <div class="memory-match-game">
                <div class="game-header">
                    <div class="game-score">Pairs: <span id="gameScore">0</span>/${cardCount/2}</div>
                    <div class="game-time">Time: <span id="gameTime">30</span>s</div>
                </div>
                <div class="memory-grid" id="memoryGrid">
                    ${cards.map((card, index) => `
                        <div class="memory-card" data-index="${index}" data-value="${card.value}">
                            <div class="card-back">❓</div>
                            <div class="card-front">${card.emoji}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Game logic
        let flippedCards = [];
        let matchedPairs = 0;
        let canFlip = true;
        
        const flipCard = (cardElement) => {
            if (!canFlip || cardElement.classList.contains('flipped') || 
                cardElement.classList.contains('matched')) return;
            
            cardElement.classList.add('flipped');
            flippedCards.push(cardElement);
            
            if (flippedCards.length === 2) {
                canFlip = false;
                
                if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
                    // Match found
                    flippedCards.forEach(card => card.classList.add('matched'));
                    matchedPairs++;
                    document.getElementById('gameScore').textContent = matchedPairs;
                    
                    if (matchedPairs === cardCount/2) {
                        this.endMinigame(matchedPairs);
                        return;
                    }
                } else {
                    // No match
                    setTimeout(() => {
                        flippedCards.forEach(card => card.classList.remove('flipped'));
                    }, 1000);
                }
                
                flippedCards = [];
                canFlip = true;
            }
        };
        
        // Add click handlers
        document.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', () => flipCard(card));
        });
        
        // Start timer
        this.startGameTimer();
    }
    
    generateMemoryCards(count) {
        const emojis = ['🐉', '🔥', '⚡', '💎', '👑', '⭐', '🌙', '☀️', '🌺', '🍀', '🎯', '🎪'];
        const cards = [];
        
        for (let i = 0; i < count/2; i++) {
            const emoji = emojis[i % emojis.length];
            cards.push({ value: i, emoji: emoji });
            cards.push({ value: i, emoji: emoji });
        }
        
        // Shuffle
        return cards.sort(() => Math.random() - 0.5);
    }
    
    getDifficultyCardCount(difficulty) {
        const counts = { easy: 8, medium: 12, hard: 16 };
        return counts[difficulty] || 8;
    }
    
    startReactionTimer(difficulty) {
        const container = document.getElementById('minigameArea');
        if (!container) return;
        
        container.innerHTML = `
            <div class="reaction-timer-game">
                <div class="game-header">
                    <div class="game-score">Clicks: <span id="gameScore">0</span></div>
                    <div class="game-time">Time: <span id="gameTime">30</span>s</div>
                </div>
                <div class="reaction-area" id="reactionArea">
                    <div class="reaction-target" id="reactionTarget">Wait for green...</div>
                </div>
                <div class="game-instructions">
                    Click the target when it turns green!
                </div>
            </div>
        `;
        
        // Game logic
        const target = document.getElementById('reactionTarget');
        let clicks = 0;
        let isGreen = false;
        let lastChange = Date.now();
        const minDelay = this.getDifficultyDelay(difficulty);
        
        const changeColor = () => {
            if (!this.isGameActive) return;
            
            const now = Date.now();
            if (now - lastChange < minDelay) {
                setTimeout(changeColor, minDelay - (now - lastChange));
                return;
            }
            
            isGreen = Math.random() < 0.3; // 30% chance of green
            target.style.backgroundColor = isGreen ? '#00ff00' : '#ff0000';
            target.textContent = isGreen ? 'CLICK NOW!' : 'Wait...';
            lastChange = now;
            
            if (this.isGameActive) {
                setTimeout(changeColor, 1000 + Math.random() * 2000);
            }
        };
        
        const handleClick = () => {
            if (!this.isGameActive) return;
            
            if (isGreen) {
                clicks++;
                document.getElementById('gameScore').textContent = clicks;
                this.game.systems.audio.playSound('click');
                target.style.backgroundColor = '#ff0000';
                target.textContent = 'Wait...';
                isGreen = false;
            } else {
                clicks = Math.max(0, clicks - 1);
                document.getElementById('gameScore').textContent = clicks;
            }
        };
        
        target.addEventListener('click', handleClick);
        
        // Start color changes
        setTimeout(changeColor, 2000);
        
        // Start timer
        this.startGameTimer();
    }
    
    getDifficultyDelay(difficulty) {
        const delays = { easy: 2000, medium: 1500, hard: 1000, extreme: 500 };
        return delays[difficulty] || 2000;
    }
    
    getDifficultySpeed(difficulty) {
        const speeds = { easy: 2, medium: 3, hard: 4, extreme: 6 };
        return speeds[difficulty] || 2;
    }
    
    startMathQuiz(difficulty) {
        const container = document.getElementById('minigameArea');
        if (!container) return;
        
        container.innerHTML = `
            <div class="math-quiz-game">
                <div class="game-header">
                    <div class="game-score">Correct: <span id="gameScore">0</span></div>
                    <div class="game-time">Time: <span id="gameTime">30</span>s</div>
                </div>
                <div class="math-problem" id="mathProblem">
                    <div class="problem-text">Get ready...</div>
                    <div class="answer-input">
                        <input type="number" id="mathAnswer" placeholder="Enter answer">
                        <button id="submitAnswer">Submit</button>
                    </div>
                </div>
            </div>
        `;
        
        // Game logic
        let correctAnswers = 0;
        let currentProblem = null;
        
        const generateProblem = () => {
            if (!this.isGameActive) return;
            
            const difficulty = this.gameState.difficulty;
            let a, b, operator, answer;
            
            switch (difficulty) {
                case 'easy':
                    a = Math.floor(Math.random() * 10) + 1;
                    b = Math.floor(Math.random() * 10) + 1;
                    operator = Math.random() < 0.5 ? '+' : '-';
                    answer = operator === '+' ? a + b : a - b;
                    break;
                case 'medium':
                    a = Math.floor(Math.random() * 20) + 1;
                    b = Math.floor(Math.random() * 20) + 1;
                    operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
                    answer = operator === '+' ? a + b : operator === '-' ? a - b : a * b;
                    break;
                case 'hard':
                    a = Math.floor(Math.random() * 50) + 1;
                    b = Math.floor(Math.random() * 50) + 1;
                    operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
                    if (operator === '/') {
                        answer = a;
                        a = a * b;
                    } else {
                        answer = operator === '+' ? a + b : operator === '-' ? a - b : a * b;
                    }
                    break;
            }
            
            currentProblem = { a, b, operator, answer };
            document.getElementById('mathProblem').querySelector('.problem-text').textContent = 
                `${a} ${operator} ${b} = ?`;
        };
        
        const submitAnswer = () => {
            if (!this.isGameActive || !currentProblem) return;
            
            const input = document.getElementById('mathAnswer');
            const userAnswer = parseInt(input.value);
            
            if (userAnswer === currentProblem.answer) {
                correctAnswers++;
                document.getElementById('gameScore').textContent = correctAnswers;
                this.game.systems.audio.playSound('achievement');
            }
            
            input.value = '';
            generateProblem();
        };
        
        document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
        document.getElementById('mathAnswer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitAnswer();
        });
        
        // Start game
        setTimeout(generateProblem, 1000);
        
        // Start timer
        this.startGameTimer();
    }
    
    startDungeonCrawler(difficulty) {
        const container = document.getElementById('minigameArea');
        if (!container) return;
        
        container.innerHTML = `
            <div class="dungeon-crawler-game">
                <div class="game-header">
                    <div class="game-score">Treasures: <span id="gameScore">0</span></div>
                    <div class="game-time">Time: <span id="gameTime">30</span>s</div>
                </div>
                <div class="dungeon-grid" id="dungeonGrid"></div>
                <div class="game-instructions">
                    Use arrow keys to move and collect treasures!
                </div>
            </div>
        `;
        
        // Game logic
        const gridSize = 10;
        const grid = document.getElementById('dungeonGrid');
        let playerPos = { x: 0, y: 0 };
        let treasures = 0;
        let gameMap = [];
        
        // Initialize map
        for (let y = 0; y < gridSize; y++) {
            gameMap[y] = [];
            for (let x = 0; x < gridSize; x++) {
                gameMap[y][x] = Math.random() < 0.1 ? 'treasure' : 'empty';
            }
        }
        
        const renderMap = () => {
            grid.innerHTML = '';
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'dungeon-cell';
                    
                    if (x === playerPos.x && y === playerPos.y) {
                        cell.textContent = '👤';
                        cell.classList.add('player');
                    } else if (gameMap[y][x] === 'treasure') {
                        cell.textContent = '💎';
                        cell.classList.add('treasure');
                    }
                    
                    grid.appendChild(cell);
                }
            }
        };
        
        const movePlayer = (dx, dy) => {
            if (!this.isGameActive) return;
            
            const newX = playerPos.x + dx;
            const newY = playerPos.y + dy;
            
            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
                playerPos.x = newX;
                playerPos.y = newY;
                
                if (gameMap[newY][newX] === 'treasure') {
                    treasures++;
                    gameMap[newY][newX] = 'empty';
                    document.getElementById('gameScore').textContent = treasures;
                    this.game.systems.audio.playSound('achievement');
                }
                
                renderMap();
            }
        };
        
        // Controls
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp': movePlayer(0, -1); break;
                case 'ArrowDown': movePlayer(0, 1); break;
                case 'ArrowLeft': movePlayer(-1, 0); break;
                case 'ArrowRight': movePlayer(1, 0); break;
            }
        });
        
        // Start game
        renderMap();
        
        // Start timer
        this.startGameTimer();
    }
    
    startGameTimer() {
        const timeElement = document.getElementById('gameTime');
        if (!timeElement) return;
        
        const startTime = Date.now();
        const duration = this.gameDuration;
        
        const updateTimer = () => {
            if (!this.isGameActive) return;
            
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
            
            timeElement.textContent = remaining;
            
            if (remaining <= 0) {
                this.endMinigame(this.gameState.score);
            } else {
                requestAnimationFrame(updateTimer);
            }
        };
        
        updateTimer();
    }
    
    endMinigame(score) {
        this.isGameActive = false;
        this.gameState.endTime = Date.now();
        this.gameState.score = score;
        
        const minigame = this.minigames[this.currentGame];
        const difficulty = this.gameState.difficulty;
        const rewards = minigame.rewards[difficulty];
        
        // Apply rewards
        this.game.gameState.coins += rewards.coins;
        this.game.gameState.xp += rewards.xp;
        this.game.gameState.diamonds += rewards.diamonds;
        
        // Update high score
        this.updateHighScore(this.currentGame, score);
        
        // Show results
        const modalData = {
            title: `🎮 ${minigame.name} Complete!`,
            content: `
                <div class="minigame-results">
                    <div class="result-score">Final Score: ${score}</div>
                    <div class="result-rewards">
                        <div>💰 +${rewards.coins} coins</div>
                        <div>⭐ +${rewards.xp} XP</div>
                        <div>💎 +${rewards.diamonds} diamonds</div>
                    </div>
                    <div class="result-high-score">
                        High Score: ${this.getHighScore(this.currentGame)}
                    </div>
                </div>
            `,
            buttons: ['Play Again', 'Close']
        };
        
        this.game.systems.modals.show(modalData, (button) => {
            if (button === 'Play Again') {
                this.showMinigameMenu(this.currentGame);
            }
        });
        
        // Update game stats
        this.game.gameState.minigamesPlayed++;
        
        // Check achievements
        this.game.systems.achievements.checkMinigameAchievements();
        
        // Clear game area
        const container = document.getElementById('minigameArea');
        if (container) {
            container.innerHTML = '<div class="minigame-selector">Select a minigame to play!</div>';
        }
    }
    
    getHighScore(gameId) {
        return this.highScores[gameId] || 0;
    }
    
    updateHighScore(gameId, score) {
        if (!this.highScores[gameId] || score > this.highScores[gameId]) {
            this.highScores[gameId] = score;
            this.saveHighScores();
            return true;
        }
        return false;
    }
    
    loadHighScores() {
        const saved = localStorage.getItem('minigame_high_scores');
        if (saved) {
            this.highScores = JSON.parse(saved);
        }
    }
    
    saveHighScores() {
        localStorage.setItem('minigame_high_scores', JSON.stringify(this.highScores));
    }
    
    update(deltaTime) {
        if (this.isGameActive) {
            this.gameTimer += deltaTime;
        }
    }
    
    reset() {
        this.currentGame = null;
        this.gameState = null;
        this.isGameActive = false;
        this.gameTimer = 0;
        this.highScores = {};
        this.saveHighScores();
        
        const container = document.getElementById('minigameArea');
        if (container) {
            container.innerHTML = '<div class="minigame-selector">Select a minigame to play!</div>';
        }
    }
}