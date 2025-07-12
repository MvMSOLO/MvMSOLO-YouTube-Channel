# 🎮 Epic Clicker Tycoon RPG

A massive browser-based incremental clicker game with over 1000 creative and interactive features! Click, upgrade, unlock skins, defeat bosses, and explore endless content.

## 🌟 Features

### 🎯 Core Gameplay
- **Clicking System**: Central clickable object with damage calculation, critical hits, and combo system
- **Currency System**: Coins, diamonds, and score with multipliers and prestige bonuses
- **Level System**: XP-based progression with rewards and unlocks
- **Auto Clickers**: Multiple tiers of automatic clicking machines

### 🛒 Shop & Upgrades
- **100+ Unique Skins**: Common, Rare, Epic, Legendary, Rainbow, Event, Godly, and Expensive rarities
- **Upgrade Tree**: Complex upgrade system with multiple paths and synergies
- **Auto Clickers**: 5 tiers of automatic clicking with increasing power
- **Multipliers**: Click power, coin, diamond, and score multipliers

### 🏆 Achievements & Progression
- **200+ Achievements**: Across 10 categories with rewards and progression tracking
- **Statistics Tracking**: Comprehensive stats for all game activities
- **Daily Rewards**: Daily login system with streaks and bonuses
- **Prestige System**: Reset for permanent bonuses and new content

### 👹 Boss Battles
- **10 Epic Bosses**: From Goblin Chief to Void Emperor with unique abilities
- **Boss Phases**: Normal, Enraged, and Berserk phases with increasing difficulty
- **Special Abilities**: Each boss has unique abilities and attack patterns
- **Rewards**: Massive rewards for defeating bosses

### 🎮 Minigames
- **10 Minigames**: Flappy Clicker, Memory Match, Reaction Timer, Math Quiz, and more
- **Multiple Difficulties**: Easy, Medium, Hard, and Extreme modes
- **Rewards**: Coins, XP, and diamonds for completing minigames
- **Achievements**: Special achievements for minigame mastery

### 🎨 Visual & Audio
- **Particle Effects**: Dynamic particle systems for clicks and special events
- **Sound Effects**: Unique sounds for each skin and game event
- **Animations**: Smooth animations and visual feedback
- **Themes**: Light, dark, and custom gradient themes

### 🔧 Developer Features
- **Developer Console**: Press Ctrl+Shift+D to open the developer console
- **Cheat Codes**: Konami code and other secret combinations
- **Easter Eggs**: Hidden content and secret areas
- **Performance Monitoring**: FPS tracking and optimization

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Local server (for loading JSON config files)

### Installation
1. Download or clone the repository
2. Set up a local web server (due to CORS restrictions for JSON loading)
3. Open `index.html` in your browser

### Quick Start with Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

### Quick Start with Node.js
```bash
# Install http-server globally
npm install -g http-server

# Start server
http-server -p 8000
```

## 🎮 How to Play

### Basic Controls
- **Click**: Click the central object to earn coins and XP
- **Spacebar/Enter**: Alternative clicking method
- **Touch**: Full mobile support with touch controls

### Game Progression
1. **Start Clicking**: Begin with the Baby Dragon skin
2. **Earn Coins**: Each click earns coins based on your click power
3. **Buy Upgrades**: Purchase upgrades to increase click power and efficiency
4. **Unlock Skins**: Buy new skins for different effects and sounds
5. **Defeat Bosses**: Challenge bosses for massive rewards
6. **Play Minigames**: Complete minigames for bonus rewards
7. **Prestige**: Reset for permanent bonuses when progress slows

### Currency System
- **Coins**: Basic currency earned from clicking and auto clickers
- **Diamonds**: Premium currency with rare drop chance
- **Score**: Cumulative score for leaderboards and achievements

### Upgrade Strategy
1. **Early Game**: Focus on basic click power upgrades
2. **Mid Game**: Invest in auto clickers and multipliers
3. **Late Game**: Purchase expensive upgrades and prestige bonuses
4. **End Game**: Challenge bosses and complete achievements

## 🔧 Developer Console

Press `Ctrl+Shift+D` to open the developer console with commands:

### Basic Commands
- `help` - Show available commands
- `coins [amount]` - Add coins (default: 1000)
- `diamonds [amount]` - Add diamonds (default: 100)
- `level [level]` - Set player level (default: 10)
- `power [amount]` - Set click power (default: 100)

### Advanced Commands
- `skin [id]` - Change current skin
- `unlock skin [id]` - Unlock a skin
- `prestige [count]` - Add prestige count
- `boss [id]` - Defeat a boss
- `achievement [id]` - Unlock an achievement
- `stats` - Show game statistics

## 🎯 Cheat Codes

### Konami Code
Press: ↑ ↑ ↓ ↓ ← → ← → B A
Effect: Unlocks all skins and achievements, gives massive rewards

### Other Cheats
- `Ctrl+Shift+G`: God Mode (max stats)
- `Ctrl+Shift+M`: Infinite Money
- `Ctrl+Shift+L`: Max Level

## 📁 File Structure

```
epic-clicker-tycoon-rpg/
├── index.html              # Main HTML file
├── style.css               # Main stylesheet
├── js/
│   ├── main.js             # Main entry point
│   ├── core/
│   │   ├── game.js         # Main game core
│   │   ├── save.js         # Save system
│   │   └── audio.js        # Audio system
│   ├── systems/
│   │   ├── clicking.js     # Clicking system
│   │   ├── shop.js         # Shop system
│   │   └── placeholder-systems.js # Other systems
│   └── utils/              # Utility functions
├── config/
│   ├── skins.json          # Skin configurations
│   ├── upgrades.json       # Upgrade configurations
│   ├── achievements.json   # Achievement configurations
│   ├── bosses.json         # Boss configurations
│   └── minigames.json      # Minigame configurations
├── assets/
│   ├── skins/              # Skin assets
│   ├── sounds/             # Sound effects
│   └── icons/              # Game icons
└── README.md               # This file
```

## 🎨 Customization

### Adding New Skins
1. Edit `config/skins.json`
2. Add skin data with required fields
3. Add corresponding assets to `assets/skins/`

### Adding New Upgrades
1. Edit `config/upgrades.json`
2. Add upgrade data with pricing and effects
3. Implement upgrade logic in the upgrade system

### Adding New Achievements
1. Edit `config/achievements.json`
2. Add achievement data with requirements
3. Implement achievement checking logic

## 🔧 Technical Details

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- 60 FPS target
- Automatic performance monitoring
- Particle effect optimization
- Memory management for long sessions

### Save System
- LocalStorage-based saving
- Automatic save every 30 seconds
- Backup save system
- Export/import functionality

### Audio System
- Web Audio API support
- Fallback audio for older browsers
- Dynamic sound generation
- Volume controls and muting

## 🐛 Known Issues

- JSON loading requires a web server (CORS restrictions)
- Some audio features may not work in older browsers
- Particle effects may impact performance on low-end devices

## 🚀 Future Features

- Cloud save system
- Multiplayer features
- More minigames
- Additional boss types
- Seasonal events
- Mobile app version

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 🎉 Credits

Created with ❤️ for the incremental gaming community.

---

**Enjoy the game! Click away and become the ultimate clicker master! 🎮✨**
