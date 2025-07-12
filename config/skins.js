// Epic Clicker Tycoon RPG - Skins Configuration
// Over 100 unique skins with different rarities and effects

const SKINS_CONFIG = {
    // Common Skins (25 skins)
    common: [
        { id: 'dragon_basic', name: 'Basic Dragon', emoji: '🐉', rarity: 'common', cost: 100, effect: 'Basic clicking power' },
        { id: 'monster_basic', name: 'Basic Monster', emoji: '👹', rarity: 'common', cost: 150, effect: 'Basic clicking power' },
        { id: 'robot_basic', name: 'Basic Robot', emoji: '🤖', rarity: 'common', cost: 200, effect: 'Basic clicking power' },
        { id: 'cat_basic', name: 'Basic Cat', emoji: '🐱', rarity: 'common', cost: 250, effect: 'Basic clicking power' },
        { id: 'dog_basic', name: 'Basic Dog', emoji: '🐕', rarity: 'common', cost: 300, effect: 'Basic clicking power' },
        { id: 'bird_basic', name: 'Basic Bird', emoji: '🐦', rarity: 'common', cost: 350, effect: 'Basic clicking power' },
        { id: 'fish_basic', name: 'Basic Fish', emoji: '🐟', rarity: 'common', cost: 400, effect: 'Basic clicking power' },
        { id: 'bear_basic', name: 'Basic Bear', emoji: '🐻', rarity: 'common', cost: 450, effect: 'Basic clicking power' },
        { id: 'wolf_basic', name: 'Basic Wolf', emoji: '🐺', rarity: 'common', cost: 500, effect: 'Basic clicking power' },
        { id: 'lion_basic', name: 'Basic Lion', emoji: '🦁', rarity: 'common', cost: 550, effect: 'Basic clicking power' },
        { id: 'tiger_basic', name: 'Basic Tiger', emoji: '🐯', rarity: 'common', cost: 600, effect: 'Basic clicking power' },
        { id: 'elephant_basic', name: 'Basic Elephant', emoji: '🐘', rarity: 'common', cost: 650, effect: 'Basic clicking power' },
        { id: 'giraffe_basic', name: 'Basic Giraffe', emoji: '🦒', rarity: 'common', cost: 700, effect: 'Basic clicking power' },
        { id: 'penguin_basic', name: 'Basic Penguin', emoji: '🐧', rarity: 'common', cost: 750, effect: 'Basic clicking power' },
        { id: 'owl_basic', name: 'Basic Owl', emoji: '🦉', rarity: 'common', cost: 800, effect: 'Basic clicking power' },
        { id: 'fox_basic', name: 'Basic Fox', emoji: '🦊', rarity: 'common', cost: 850, effect: 'Basic clicking power' },
        { id: 'rabbit_basic', name: 'Basic Rabbit', emoji: '🐰', rarity: 'common', cost: 900, effect: 'Basic clicking power' },
        { id: 'deer_basic', name: 'Basic Deer', emoji: '🦌', rarity: 'common', cost: 950, effect: 'Basic clicking power' },
        { id: 'horse_basic', name: 'Basic Horse', emoji: '🐎', rarity: 'common', cost: 1000, effect: 'Basic clicking power' },
        { id: 'cow_basic', name: 'Basic Cow', emoji: '🐄', rarity: 'common', cost: 1050, effect: 'Basic clicking power' },
        { id: 'pig_basic', name: 'Basic Pig', emoji: '🐷', rarity: 'common', cost: 1100, effect: 'Basic clicking power' },
        { id: 'sheep_basic', name: 'Basic Sheep', emoji: '🐑', rarity: 'common', cost: 1150, effect: 'Basic clicking power' },
        { id: 'chicken_basic', name: 'Basic Chicken', emoji: '🐔', rarity: 'common', cost: 1200, effect: 'Basic clicking power' },
        { id: 'duck_basic', name: 'Basic Duck', emoji: '🦆', rarity: 'common', cost: 1250, effect: 'Basic clicking power' },
        { id: 'goose_basic', name: 'Basic Goose', emoji: '🦢', rarity: 'common', cost: 1300, effect: 'Basic clicking power' }
    ],

    // Rare Skins (20 skins)
    rare: [
        { id: 'dragon_fire', name: 'Fire Dragon', emoji: '🔥🐉', rarity: 'rare', cost: 2500, effect: '+25% click power' },
        { id: 'monster_ice', name: 'Ice Monster', emoji: '❄️👹', rarity: 'rare', cost: 3000, effect: '+30% click power' },
        { id: 'robot_steel', name: 'Steel Robot', emoji: '⚙️🤖', rarity: 'rare', cost: 3500, effect: '+35% click power' },
        { id: 'cat_ninja', name: 'Ninja Cat', emoji: '🥷🐱', rarity: 'rare', cost: 4000, effect: '+40% click power' },
        { id: 'dog_knight', name: 'Knight Dog', emoji: '⚔️🐕', rarity: 'rare', cost: 4500, effect: '+45% click power' },
        { id: 'bird_phoenix', name: 'Phoenix Bird', emoji: '🔥🐦', rarity: 'rare', cost: 5000, effect: '+50% click power' },
        { id: 'fish_shark', name: 'Shark Fish', emoji: '🦈', rarity: 'rare', cost: 5500, effect: '+55% click power' },
        { id: 'bear_polar', name: 'Polar Bear', emoji: '🐻‍❄️', rarity: 'rare', cost: 6000, effect: '+60% click power' },
        { id: 'wolf_alpha', name: 'Alpha Wolf', emoji: '🐺👑', rarity: 'rare', cost: 6500, effect: '+65% click power' },
        { id: 'lion_golden', name: 'Golden Lion', emoji: '🦁✨', rarity: 'rare', cost: 7000, effect: '+70% click power' },
        { id: 'tiger_striped', name: 'Striped Tiger', emoji: '🐯⚡', rarity: 'rare', cost: 7500, effect: '+75% click power' },
        { id: 'elephant_royal', name: 'Royal Elephant', emoji: '🐘👑', rarity: 'rare', cost: 8000, effect: '+80% click power' },
        { id: 'giraffe_tall', name: 'Tall Giraffe', emoji: '🦒🌲', rarity: 'rare', cost: 8500, effect: '+85% click power' },
        { id: 'penguin_emperor', name: 'Emperor Penguin', emoji: '🐧👑', rarity: 'rare', cost: 9000, effect: '+90% click power' },
        { id: 'owl_wise', name: 'Wise Owl', emoji: '🦉📚', rarity: 'rare', cost: 9500, effect: '+95% click power' },
        { id: 'fox_cunning', name: 'Cunning Fox', emoji: '🦊🎭', rarity: 'rare', cost: 10000, effect: '+100% click power' },
        { id: 'rabbit_speed', name: 'Speed Rabbit', emoji: '🐰⚡', rarity: 'rare', cost: 10500, effect: '+105% click power' },
        { id: 'deer_majestic', name: 'Majestic Deer', emoji: '🦌✨', rarity: 'rare', cost: 11000, effect: '+110% click power' },
        { id: 'horse_unicorn', name: 'Unicorn Horse', emoji: '🦄', rarity: 'rare', cost: 11500, effect: '+115% click power' },
        { id: 'cow_magical', name: 'Magical Cow', emoji: '🐄✨', rarity: 'rare', cost: 12000, effect: '+120% click power' }
    ],

    // Epic Skins (20 skins)
    epic: [
        { id: 'dragon_ancient', name: 'Ancient Dragon', emoji: '🐉🏛️', rarity: 'epic', cost: 15000, effect: '+150% click power, +10% auto clicker' },
        { id: 'monster_legendary', name: 'Legendary Monster', emoji: '👹⚡', rarity: 'epic', cost: 18000, effect: '+180% click power, +15% auto clicker' },
        { id: 'robot_cyber', name: 'Cyber Robot', emoji: '🤖💻', rarity: 'epic', cost: 21000, effect: '+210% click power, +20% auto clicker' },
        { id: 'cat_samurai', name: 'Samurai Cat', emoji: '🐱🗡️', rarity: 'epic', cost: 24000, effect: '+240% click power, +25% auto clicker' },
        { id: 'dog_paladin', name: 'Paladin Dog', emoji: '🐕🛡️', rarity: 'epic', cost: 27000, effect: '+270% click power, +30% auto clicker' },
        { id: 'bird_thunder', name: 'Thunder Bird', emoji: '🐦⚡', rarity: 'epic', cost: 30000, effect: '+300% click power, +35% auto clicker' },
        { id: 'fish_leviathan', name: 'Leviathan Fish', emoji: '🐋', rarity: 'epic', cost: 33000, effect: '+330% click power, +40% auto clicker' },
        { id: 'bear_berserker', name: 'Berserker Bear', emoji: '🐻⚔️', rarity: 'epic', cost: 36000, effect: '+360% click power, +45% auto clicker' },
        { id: 'wolf_phantom', name: 'Phantom Wolf', emoji: '🐺👻', rarity: 'epic', cost: 39000, effect: '+390% click power, +50% auto clicker' },
        { id: 'lion_solar', name: 'Solar Lion', emoji: '🦁☀️', rarity: 'epic', cost: 42000, effect: '+420% click power, +55% auto clicker' },
        { id: 'tiger_lunar', name: 'Lunar Tiger', emoji: '🐯🌙', rarity: 'epic', cost: 45000, effect: '+450% click power, +60% auto clicker' },
        { id: 'elephant_cosmic', name: 'Cosmic Elephant', emoji: '🐘🌌', rarity: 'epic', cost: 48000, effect: '+480% click power, +65% auto clicker' },
        { id: 'giraffe_celestial', name: 'Celestial Giraffe', emoji: '🦒⭐', rarity: 'epic', cost: 51000, effect: '+510% click power, +70% auto clicker' },
        { id: 'penguin_arctic', name: 'Arctic Penguin', emoji: '🐧❄️', rarity: 'epic', cost: 54000, effect: '+540% click power, +75% auto clicker' },
        { id: 'owl_mystic', name: 'Mystic Owl', emoji: '🦉🔮', rarity: 'epic', cost: 57000, effect: '+570% click power, +80% auto clicker' },
        { id: 'fox_illusion', name: 'Illusion Fox', emoji: '🦊🎪', rarity: 'epic', cost: 60000, effect: '+600% click power, +85% auto clicker' },
        { id: 'rabbit_time', name: 'Time Rabbit', emoji: '🐰⏰', rarity: 'epic', cost: 63000, effect: '+630% click power, +90% auto clicker' },
        { id: 'deer_nature', name: 'Nature Deer', emoji: '🦌🌿', rarity: 'epic', cost: 66000, effect: '+660% click power, +95% auto clicker' },
        { id: 'horse_pegasus', name: 'Pegasus Horse', emoji: '🦄🦅', rarity: 'epic', cost: 69000, effect: '+690% click power, +100% auto clicker' },
        { id: 'cow_cosmic', name: 'Cosmic Cow', emoji: '🐄🌌', rarity: 'epic', cost: 72000, effect: '+720% click power, +105% auto clicker' }
    ],

    // Legendary Skins (15 skins)
    legendary: [
        { id: 'dragon_god', name: 'God Dragon', emoji: '🐉👑', rarity: 'legendary', cost: 100000, effect: '+500% click power, +200% auto clicker, +50% multiplier' },
        { id: 'monster_titan', name: 'Titan Monster', emoji: '👹⚡', rarity: 'legendary', cost: 120000, effect: '+600% click power, +250% auto clicker, +60% multiplier' },
        { id: 'robot_ai', name: 'AI Robot', emoji: '🤖🧠', rarity: 'legendary', cost: 140000, effect: '+700% click power, +300% auto clicker, +70% multiplier' },
        { id: 'cat_legend', name: 'Legend Cat', emoji: '🐱⚔️', rarity: 'legendary', cost: 160000, effect: '+800% click power, +350% auto clicker, +80% multiplier' },
        { id: 'dog_hero', name: 'Hero Dog', emoji: '🐕🦸', rarity: 'legendary', cost: 180000, effect: '+900% click power, +400% auto clicker, +90% multiplier' },
        { id: 'bird_divine', name: 'Divine Bird', emoji: '🐦👼', rarity: 'legendary', cost: 200000, effect: '+1000% click power, +450% auto clicker, +100% multiplier' },
        { id: 'fish_mythic', name: 'Mythic Fish', emoji: '🐋🌊', rarity: 'legendary', cost: 220000, effect: '+1100% click power, +500% auto clicker, +110% multiplier' },
        { id: 'bear_immortal', name: 'Immortal Bear', emoji: '🐻💀', rarity: 'legendary', cost: 240000, effect: '+1200% click power, +550% auto clicker, +120% multiplier' },
        { id: 'wolf_eternal', name: 'Eternal Wolf', emoji: '🐺♾️', rarity: 'legendary', cost: 260000, effect: '+1300% click power, +600% auto clicker, +130% multiplier' },
        { id: 'lion_phoenix', name: 'Phoenix Lion', emoji: '🦁🔥', rarity: 'legendary', cost: 280000, effect: '+1400% click power, +650% auto clicker, +140% multiplier' },
        { id: 'tiger_dragon', name: 'Dragon Tiger', emoji: '🐯🐉', rarity: 'legendary', cost: 300000, effect: '+1500% click power, +700% auto clicker, +150% multiplier' },
        { id: 'elephant_titan', name: 'Titan Elephant', emoji: '🐘⚡', rarity: 'legendary', cost: 320000, effect: '+1600% click power, +750% auto clicker, +160% multiplier' },
        { id: 'giraffe_cosmic', name: 'Cosmic Giraffe', emoji: '🦒🌌', rarity: 'legendary', cost: 340000, effect: '+1700% click power, +800% auto clicker, +170% multiplier' },
        { id: 'penguin_ice', name: 'Ice Penguin', emoji: '🐧❄️', rarity: 'legendary', cost: 360000, effect: '+1800% click power, +850% auto clicker, +180% multiplier' },
        { id: 'owl_wisdom', name: 'Wisdom Owl', emoji: '🦉📖', rarity: 'legendary', cost: 380000, effect: '+1900% click power, +900% auto clicker, +190% multiplier' }
    ],

    // Godly Skins (10 skins)
    godly: [
        { id: 'dragon_omni', name: 'Omnipotent Dragon', emoji: '🐉✨', rarity: 'godly', cost: 500000, effect: '+2000% click power, +1000% auto clicker, +500% multiplier, +100% prestige bonus' },
        { id: 'monster_chaos', name: 'Chaos Monster', emoji: '👹🌀', rarity: 'godly', cost: 600000, effect: '+2500% click power, +1200% auto clicker, +600% multiplier, +120% prestige bonus' },
        { id: 'robot_quantum', name: 'Quantum Robot', emoji: '🤖⚛️', rarity: 'godly', cost: 700000, effect: '+3000% click power, +1400% auto clicker, +700% multiplier, +140% prestige bonus' },
        { id: 'cat_void', name: 'Void Cat', emoji: '🐱🌌', rarity: 'godly', cost: 800000, effect: '+3500% click power, +1600% auto clicker, +800% multiplier, +160% prestige bonus' },
        { id: 'dog_celestial', name: 'Celestial Dog', emoji: '🐕⭐', rarity: 'godly', cost: 900000, effect: '+4000% click power, +1800% auto clicker, +900% multiplier, +180% prestige bonus' },
        { id: 'bird_infinity', name: 'Infinity Bird', emoji: '🐦♾️', rarity: 'godly', cost: 1000000, effect: '+4500% click power, +2000% auto clicker, +1000% multiplier, +200% prestige bonus' },
        { id: 'fish_abyss', name: 'Abyss Fish', emoji: '🐋🌊', rarity: 'godly', cost: 1100000, effect: '+5000% click power, +2200% auto clicker, +1100% multiplier, +220% prestige bonus' },
        { id: 'bear_eternal', name: 'Eternal Bear', emoji: '🐻♾️', rarity: 'godly', cost: 1200000, effect: '+5500% click power, +2400% auto clicker, +1200% multiplier, +240% prestige bonus' },
        { id: 'wolf_phantom', name: 'Phantom Wolf', emoji: '🐺👻', rarity: 'godly', cost: 1300000, effect: '+6000% click power, +2600% auto clicker, +1300% multiplier, +260% prestige bonus' },
        { id: 'lion_supreme', name: 'Supreme Lion', emoji: '🦁👑', rarity: 'godly', cost: 1400000, effect: '+6500% click power, +2800% auto clicker, +1400% multiplier, +280% prestige bonus' }
    ],

    // Event Skins (10 skins)
    event: [
        { id: 'dragon_halloween', name: 'Halloween Dragon', emoji: '🐉🎃', rarity: 'event', cost: 75000, effect: '+300% click power, Halloween theme' },
        { id: 'monster_christmas', name: 'Christmas Monster', emoji: '👹🎄', rarity: 'event', cost: 80000, effect: '+350% click power, Christmas theme' },
        { id: 'robot_newyear', name: 'New Year Robot', emoji: '🤖🎆', rarity: 'event', cost: 85000, effect: '+400% click power, New Year theme' },
        { id: 'cat_valentine', name: 'Valentine Cat', emoji: '🐱💕', rarity: 'event', cost: 90000, effect: '+450% click power, Valentine theme' },
        { id: 'dog_easter', name: 'Easter Dog', emoji: '🐕🥚', rarity: 'event', cost: 95000, effect: '+500% click power, Easter theme' },
        { id: 'bird_summer', name: 'Summer Bird', emoji: '🐦☀️', rarity: 'event', cost: 100000, effect: '+550% click power, Summer theme' },
        { id: 'fish_autumn', name: 'Autumn Fish', emoji: '🐟🍂', rarity: 'event', cost: 105000, effect: '+600% click power, Autumn theme' },
        { id: 'bear_winter', name: 'Winter Bear', emoji: '🐻❄️', rarity: 'event', cost: 110000, effect: '+650% click power, Winter theme' },
        { id: 'wolf_spring', name: 'Spring Wolf', emoji: '🐺🌸', rarity: 'event', cost: 115000, effect: '+700% click power, Spring theme' },
        { id: 'lion_birthday', name: 'Birthday Lion', emoji: '🦁🎂', rarity: 'event', cost: 120000, effect: '+750% click power, Birthday theme' }
    ],

    // Rainbow Skins (5 skins)
    rainbow: [
        { id: 'dragon_rainbow', name: 'Rainbow Dragon', emoji: '🐉🌈', rarity: 'rainbow', cost: 200000, effect: '+1000% click power, Rainbow effects, +200% auto clicker' },
        { id: 'monster_rainbow', name: 'Rainbow Monster', emoji: '👹🌈', rarity: 'rainbow', cost: 250000, effect: '+1200% click power, Rainbow effects, +250% auto clicker' },
        { id: 'robot_rainbow', name: 'Rainbow Robot', emoji: '🤖🌈', rarity: 'rainbow', cost: 300000, effect: '+1400% click power, Rainbow effects, +300% auto clicker' },
        { id: 'cat_rainbow', name: 'Rainbow Cat', emoji: '🐱🌈', rarity: 'rainbow', cost: 350000, effect: '+1600% click power, Rainbow effects, +350% auto clicker' },
        { id: 'dog_rainbow', name: 'Rainbow Dog', emoji: '🐕🌈', rarity: 'rainbow', cost: 400000, effect: '+1800% click power, Rainbow effects, +400% auto clicker' }
    ],

    // Expensive Skins (5 skins)
    expensive: [
        { id: 'dragon_platinum', name: 'Platinum Dragon', emoji: '🐉💎', rarity: 'expensive', cost: 1000000, effect: '+5000% click power, Platinum effects, +1000% auto clicker' },
        { id: 'monster_diamond', name: 'Diamond Monster', emoji: '👹💎', rarity: 'expensive', cost: 1500000, effect: '+7500% click power, Diamond effects, +1500% auto clicker' },
        { id: 'robot_gold', name: 'Gold Robot', emoji: '🤖💰', rarity: 'expensive', cost: 2000000, effect: '+10000% click power, Gold effects, +2000% auto clicker' },
        { id: 'cat_silver', name: 'Silver Cat', emoji: '🐱🥈', rarity: 'expensive', cost: 2500000, effect: '+12500% click power, Silver effects, +2500% auto clicker' },
        { id: 'dog_bronze', name: 'Bronze Dog', emoji: '🐕🥉', rarity: 'expensive', cost: 3000000, effect: '+15000% click power, Bronze effects, +3000% auto clicker' }
    ]
};

// Skin rarity colors
const SKIN_RARITY_COLORS = {
    common: '#6b7280',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
    godly: '#ef4444',
    event: '#10b981',
    rainbow: '#ec4899',
    expensive: '#fbbf24'
};

// Skin rarity multipliers
const SKIN_RARITY_MULTIPLIERS = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 5,
    godly: 10,
    event: 4,
    rainbow: 6,
    expensive: 15
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SKINS_CONFIG, SKIN_RARITY_COLORS, SKIN_RARITY_MULTIPLIERS };
}