import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { RARITY_COLORS } from '@/data/gameData';
import { useGameState } from '@/hooks/useGameState';

interface DragonClickerProps {
  onParticleSpawn?: (x: number, y: number, color: string) => void;
}

export const DragonClicker: React.FC<DragonClickerProps> = ({ onParticleSpawn }) => {
  const { gameState, handleClick, damageTexts, particles } = useGameState();
  const [isClicking, setIsClicking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentSkin = gameState.skins.find(s => s.id === gameState.currentSkin);
  
  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);
    
    handleClick(x, y);
    
    // Spawn particles
    if (onParticleSpawn && currentSkin) {
      const color = RARITY_COLORS[currentSkin.rarity];
      onParticleSpawn(x, y, color);
    }
    
    // Play click sound if enabled
    if (gameState.soundEnabled && currentSkin) {
      // We'll implement sound later
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare':
        return 'glow-blue';
      case 'epic':
        return 'glow-purple';
      case 'legendary':
      case 'mythic':
      case 'godly':
        return 'glow-gold';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center w-80 h-80 mx-auto cursor-pointer select-none"
      onClick={handleClickEvent}
    >
      {/* Main Dragon/Clicker */}
      <div 
        className={cn(
          "relative text-8xl transition-all duration-150 hover:scale-105",
          isClicking && "click-bounce scale-95",
          currentSkin && getRarityGlow(currentSkin.rarity),
          currentSkin?.rarity === 'rainbow' && "animate-pulse"
        )}
        style={{
          filter: currentSkin?.rarity === 'rainbow' 
            ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))' 
            : undefined
        }}
      >
        {currentSkin?.emoji || '🐉'}
      </div>

      {/* Damage Texts */}
      {damageTexts.map(text => (
        <div
          key={text.id}
          className={cn(
            "absolute pointer-events-none font-bold text-lg damage-text z-10",
            `rarity-${text.rarity}`
          )}
          style={{
            left: text.x,
            top: text.y,
            color: RARITY_COLORS[text.rarity]
          }}
        >
          +{Math.floor(text.damage).toLocaleString()}
        </div>
      ))}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none particle-effect"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: RARITY_COLORS[particle.color],
            borderRadius: '50%',
            opacity: 1 - (particle.life / particle.maxLife)
          }}
        />
      ))}

      {/* Click Ripple Effect */}
      {isClicking && (
        <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-75" />
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Diamond, Trophy, Zap } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { XP_TO_LEVEL } from '@/data/gameData';

export const GameHeader: React.FC = () => {
  const { gameState } = useGameState();
  
  const xpRequired = XP_TO_LEVEL(gameState.level);
  const xpProgress = (gameState.xp / xpRequired) * 100;
  
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Score</p>
              <p className="text-xl font-bold text-primary">{formatNumber(gameState.score)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Coins */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-yellow-500/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Coins className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Coins</p>
              <p className="text-xl font-bold text-yellow-500">{formatNumber(gameState.coins)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Diamonds */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-blue-500/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Diamond className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Diamonds</p>
              <p className="text-xl font-bold text-blue-500">{formatNumber(gameState.diamonds)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Level */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-purple-500/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Level</p>
              <p className="text-xl font-bold text-purple-500">{gameState.level}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress Bar */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">XP Progress</span>
            <span className="text-sm text-muted-foreground">
              {formatNumber(gameState.xp)} / {formatNumber(xpRequired)}
            </span>
          </div>
          <Progress value={xpProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Multipliers Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-green-400 font-medium">Click Power</p>
            <p className="text-lg font-bold text-green-500">{gameState.clickMultiplier.toFixed(1)}x</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-orange-400 font-medium">Global</p>
            <p className="text-lg font-bold text-orange-500">{gameState.globalMultiplier.toFixed(1)}x</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-pink-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-pink-400 font-medium">Prestige</p>
            <p className="text-lg font-bold text-pink-500">{gameState.prestigeMultiplier.toFixed(1)}x</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-cyan-400 font-medium">Auto CPS</p>
            <p className="text-lg font-bold text-cyan-500">{formatNumber(gameState.autoClickerCps)}/s</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        {gameState.prestige > 0 && (
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Prestige {gameState.prestige}
          </Badge>
        )}
        
        {gameState.autoClickerCps > 0 && (
          <Badge variant="secondary" className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            Auto Active
          </Badge>
        )}
        
        {gameState.achievements.filter(a => a.completed).length > 0 && (
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
            {gameState.achievements.filter(a => a.completed).length} Achievements
          </Badge>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Diamond, Trophy, Zap } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { XP_TO_LEVEL } from '@/data/gameData';

export const GameHeader: React.FC = () => {
  const { gameState } = useGameState();
  
  const xpRequired = XP_TO_LEVEL(gameState.level);
  const xpProgress = (gameState.xp / xpRequired) * 100;
  
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Score</p>
              <p className="text-xl font-bold text-primary">{formatNumber(gameState.score)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Coins */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-yellow-500/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Coins className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Coins</p>
              <p className="text-xl font-bold text-yellow-500">{formatNumber(gameState.coins)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Diamonds */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-blue-500/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Diamond className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Diamonds</p>
              <p className="text-xl font-bold text-blue-500">{formatNumber(gameState.diamonds)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Level */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-purple-500/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Level</p>
              <p className="text-xl font-bold text-purple-500">{gameState.level}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress Bar */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">XP Progress</span>
            <span className="text-sm text-muted-foreground">
              {formatNumber(gameState.xp)} / {formatNumber(xpRequired)}
            </span>
          </div>
          <Progress value={xpProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Multipliers Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-green-400 font-medium">Click Power</p>
            <p className="text-lg font-bold text-green-500">{gameState.clickMultiplier.toFixed(1)}x</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-orange-400 font-medium">Global</p>
            <p className="text-lg font-bold text-orange-500">{gameState.globalMultiplier.toFixed(1)}x</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-pink-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-pink-400 font-medium">Prestige</p>
            <p className="text-lg font-bold text-pink-500">{gameState.prestigeMultiplier.toFixed(1)}x</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-cyan-400 font-medium">Auto CPS</p>
            <p className="text-lg font-bold text-cyan-500">{formatNumber(gameState.autoClickerCps)}/s</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        {gameState.prestige > 0 && (
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Prestige {gameState.prestige}
          </Badge>
        )}
        
        {gameState.autoClickerCps > 0 && (
          <Badge variant="secondary" className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            Auto Active
          </Badge>
        )}
        
        {gameState.achievements.filter(a => a.completed).length > 0 && (
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
    ;        {gameState.achievements.filter(a => a.completed).length} Achievements
          </Badge>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Coins, Diamond, Star, Zap, Bot } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { RARITY_COLORS } from '@/data/gameData';
import { Skin, Upgrade, AutoClicker } from '@/types/game';
import { cn } from '@/lib/utils';

export const ShopPanel: React.FC = () => {
  const { gameState, buySkin, equipSkin, buyUpgrade, buyAutoClicker } = useGameState();
  const [activeTab, setActiveTab] = useState('skins');

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-orange-400 border-orange-400';
      case 'mythic': return 'text-pink-400 border-pink-400';
      case 'rainbow': return 'text-rainbow border-rainbow';
      case 'godly': return 'text-yellow-300 border-yellow-300';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const SkinCard: React.FC<{ skin: Skin }> = ({ skin }) => {
    const canAfford = gameState[skin.currency] >= skin.price;
    const isEquipped = gameState.currentSkin === skin.id;

    return (
      <Card className={cn(
        "transition-all duration-200 hover:scale-105",
        getRarityColor(skin.rarity),
        skin.rarity === 'rainbow' && "bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="text-4xl">{skin.emoji}</div>
            <Badge className={getRarityColor(skin.rarity)}>
              {skin.rarity.toUpperCase()}
            </Badge>
          </div>
          <CardTitle className="text-lg">{skin.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Click Multiplier: <span className="text-primary font-semibold">{skin.clickMultiplier}x</span>
            </p>
            <div className="flex items-center text-sm">
              {skin.currency === 'coins' ? <Coins className="h-4 w-4 mr-1" /> : <Diamond className="h-4 w-4 mr-1" />}
              <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                {formatNumber(skin.price)}
              </span>
            </div>
          </div>
          
          {skin.owned ? (
            <Button 
              onClick={() => equipSkin(skin.id)}
              disabled={isEquipped}
              className="w-full"
              variant={isEquipped ? "secondary" : "default"}
            >
              {isEquipped ? "Equipped" : "Equip"}
            </Button>
          ) : (
            <Button 
              onClick={() => buySkin(skin.id)}
              disabled={!canAfford}
              className="w-full"
            >
              Buy
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const UpgradeCard: React.FC<{ upgrade: Upgrade }> = ({ upgrade }) => {
    const price = upgrade.price * Math.pow(2, upgrade.currentLevel);
    const canAfford = gameState[upgrade.currency] >= price;
    const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;

    return (
      <Card className="transition-all duration-200 hover:scale-105">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Star className="h-8 w-8 text-primary" />
            <Badge variant="outline">
              Level {upgrade.currentLevel}/{upgrade.maxLevel}
            </Badge>
          </div>
          <CardTitle className="text-lg">{upgrade.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{upgrade.description}</p>
          <div className="space-y-1">
            <p className="text-sm">
              Multiplier: <span className="text-primary font-semibold">{upgrade.multiplier}x</span>
            </p>
            {!isMaxLevel && (
              <div className="flex items-center text-sm">
                {upgrade.currency === 'coins' ? <Coins className="h-4 w-4 mr-1" /> : <Diamond className="h-4 w-4 mr-1" />}
                <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                  {formatNumber(price)}
                </span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => buyUpgrade(upgrade.id)}
            disabled={!canAfford || isMaxLevel}
            className="w-full"
          >
            {isMaxLevel ? "MAX LEVEL" : "Upgrade"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const AutoClickerCard: React.FC<{ autoClicker: AutoClicker }> = ({ autoClicker }) => {
    const price = autoClicker.price * Math.pow(2, autoClicker.owned);
    const canAfford = gameState[autoClicker.currency] >= price;
    const isMaxOwned = autoClicker.owned >= autoClicker.maxOwned;

    return (
      <Card className="transition-all duration-200 hover:scale-105">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Bot className="h-8 w-8 text-cyan-400" />
            <Badge variant="outline">
              Owned: {autoClicker.owned}/{autoClicker.maxOwned}
            </Badge>
          </div>
          <CardTitle className="text-lg">{autoClicker.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{autoClicker.description}</p>
          <div className="space-y-1">
            <p className="text-sm">
              CPS: <span className="text-cyan-400 font-semibold">{autoClicker.cps}</span>
            </p>
            {!isMaxOwned && (
              <div className="flex items-center text-sm">
                {autoClicker.currency === 'coins' ? <Coins className="h-4 w-4 mr-1" /> : <Diamond className="h-4 w-4 mr-1" />}
                <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                  {formatNumber(price)}
                </span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => buyAutoClicker(autoClicker.id)}
            disabled={!canAfford || isMaxOwned}
            className="w-full"
          >
            {isMaxOwned ? "MAX OWNED" : "Buy"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Zap className="h-6 w-6 mr-2" />
          Dragon Shop
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skins" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Skins
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Upgrades
            </TabsTrigger>
            <TabsTrigger value="auto" className="flex items-center">
              <Bot className="h-4 w-4 mr-2" />
              Auto Clickers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skins" className="mt-6">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameState.skins.map(skin => (
                  <SkinCard key={skin.id} skin={skin} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upgrades" className="mt-6">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameState.upgrades.map(upgrade => (
                  <UpgradeCard key={upgrade.id} upgrade={upgrade} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="auto" className="mt-6">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.autoClickers.map(autoClicker => (
                  <AutoClickerCard key={autoClicker.id} autoClicker={autoClicker} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
import { Skin, Upgrade, AutoClicker, Achievement, Boss, Quest } from '../types/game';

export const INITIAL_SKINS: Skin[] = [
  // Common Skins
  { id: 'dragon_basic', name: 'Basic Dragon', rarity: 'common', emoji: '🐉', price: 0, currency: 'coins', clickMultiplier: 1, unlocked: true, owned: true },
  { id: 'fire_dragon', name: 'Fire Dragon', rarity: 'common', emoji: '🔥', price: 100, currency: 'coins', clickMultiplier: 1.2, unlocked: true, owned: false },
  { id: 'ice_dragon', name: 'Ice Dragon', rarity: 'common', emoji: '❄️', price: 250, currency: 'coins', clickMultiplier: 1.3, unlocked: true, owned: false },
  
  // Rare Skins
  { id: 'electric_dragon', name: 'Electric Dragon', rarity: 'rare', emoji: '⚡', price: 500, currency: 'coins', clickMultiplier: 1.5, unlocked: true, owned: false },
  { id: 'earth_dragon', name: 'Earth Dragon', rarity: 'rare', emoji: '🌍', price: 1000, currency: 'coins', clickMultiplier: 1.7, unlocked: true, owned: false },
  { id: 'wind_dragon', name: 'Wind Dragon', rarity: 'rare', emoji: '🌪️', price: 2000, currency: 'coins', clickMultiplier: 2, unlocked: true, owned: false },
  
  // Epic Skins
  { id: 'shadow_dragon', name: 'Shadow Dragon', rarity: 'epic', emoji: '🌑', price: 5000, currency: 'coins', clickMultiplier: 2.5, unlocked: true, owned: false },
  { id: 'crystal_dragon', name: 'Crystal Dragon', rarity: 'epic', emoji: '💎', price: 10000, currency: 'coins', clickMultiplier: 3, unlocked: true, owned: false },
  { id: 'plasma_dragon', name: 'Plasma Dragon', rarity: 'epic', emoji: '🌟', price: 25000, currency: 'coins', clickMultiplier: 4, unlocked: true, owned: false },
  
  // Legendary Skins
  { id: 'golden_dragon', name: 'Golden Dragon', rarity: 'legendary', emoji: '👑', price: 50000, currency: 'coins', clickMultiplier: 5, unlocked: true, owned: false },
  { id: 'phoenix_dragon', name: 'Phoenix Dragon', rarity: 'legendary', emoji: '🔥', price: 100000, currency: 'coins', clickMultiplier: 7, unlocked: true, owned: false },
  { id: 'cosmic_dragon', name: 'Cosmic Dragon', rarity: 'legendary', emoji: '🌌', price: 250000, currency: 'coins', clickMultiplier: 10, unlocked: true, owned: false },
  
  // Mythic Skins
  { id: 'void_dragon', name: 'Void Dragon', rarity: 'mythic', emoji: '🕳️', price: 500000, currency: 'coins', clickMultiplier: 15, unlocked: true, owned: false },
  { id: 'time_dragon', name: 'Time Dragon', rarity: 'mythic', emoji: '⏰', price: 1000000, currency: 'coins', clickMultiplier: 20, unlocked: true, owned: false },
  
  // Rainbow Skins
  { id: 'rainbow_dragon', name: 'Rainbow Dragon', rarity: 'rainbow', emoji: '🌈', price: 50, currency: 'diamonds', clickMultiplier: 25, unlocked: true, owned: false },
  
  // Godly Skins
  { id: 'divine_dragon', name: 'Divine Dragon', rarity: 'godly', emoji: '✨', price: 100, currency: 'diamonds', clickMultiplier: 50, unlocked: true, owned: false },
  { id: 'ultimate_dragon', name: 'Ultimate Dragon', rarity: 'godly', emoji: '🔮', price: 500, currency: 'diamonds', clickMultiplier: 100, unlocked: true, owned: false },
];

export const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'click_2x', name: '2x Click Power', description: 'Double your click damage', price: 100, currency: 'coins', multiplier: 2, maxLevel: 10, currentLevel: 0, unlocked: true },
  { id: 'click_3x', name: '3x Click Power', description: 'Triple your click damage', price: 500, currency: 'coins', multiplier: 3, maxLevel: 5, currentLevel: 0, unlocked: true },
  { id: 'click_5x', name: '5x Click Power', description: '5x your click damage', price: 2500, currency: 'coins', multiplier: 5, maxLevel: 3, currentLevel: 0, unlocked: true },
  { id: 'click_10x', name: '10x Click Power', description: '10x your click damage', price: 10000, currency: 'coins', multiplier: 10, maxLevel: 2, currentLevel: 0, unlocked: true },
  { id: 'global_2x', name: 'Global 2x Multiplier', description: 'Double ALL earnings', price: 50000, currency: 'coins', multiplier: 2, maxLevel: 5, currentLevel: 0, unlocked: true },
  { id: 'diamond_gen', name: 'Diamond Generator', description: 'Generate diamonds over time', price: 100000, currency: 'coins', multiplier: 1.1, maxLevel: 10, currentLevel: 0, unlocked: true },
];

export const INITIAL_AUTO_CLICKERS: AutoClicker[] = [
  { id: 'auto_basic', name: 'Basic Auto Clicker', description: '1 click per second', price: 1000, currency: 'coins', cps: 1, owned: 0, maxOwned: 10 },
  { id: 'auto_fast', name: 'Fast Auto Clicker', description: '5 clicks per second', price: 10000, currency: 'coins', cps: 5, owned: 0, maxOwned: 5 },
  { id: 'auto_mega', name: 'Mega Auto Clicker', description: '25 clicks per second', price: 100000, currency: 'coins', cps: 25, owned: 0, maxOwned: 3 },
  { id: 'auto_ultra', name: 'Ultra Auto Clicker', description: '100 clicks per second', price: 1000000, currency: 'coins', cps: 100, owned: 0, maxOwned: 1 },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_click', name: 'First Click', description: 'Make your first click', icon: '👆', requirement: 1, currentProgress: 0, completed: false, reward: { type: 'coins', amount: 10 } },
  { id: 'hundred_clicks', name: 'Century Clicker', description: 'Make 100 clicks', icon: '💯', requirement: 100, currentProgress: 0, completed: false, reward: { type: 'coins', amount: 100 } },
  { id: 'thousand_clicks', name: 'Millennium Clicker', description: 'Make 1,000 clicks', icon: '🏆', requirement: 1000, currentProgress: 0, completed: false, reward: { type: 'diamonds', amount: 1 } },
  { id: 'first_skin', name: 'Skin Collector', description: 'Buy your first skin', icon: '🛍️', requirement: 1, currentProgress: 0, completed: false, reward: { type: 'xp', amount: 100 } },
  { id: 'first_upgrade', name: 'Power Up', description: 'Buy your first upgrade', icon: '⬆️', requirement: 1, currentProgress: 0, completed: false, reward: { type: 'coins', amount: 500 } },
  { id: 'millionaire', name: 'Millionaire', description: 'Earn 1,000,000 coins', icon: '💰', requirement: 1000000, currentProgress: 0, completed: false, reward: { type: 'diamonds', amount: 10 } },
];

export const INITIAL_BOSSES: Boss[] = [
  { id: 'goblin', name: 'Goblin King', emoji: '👹', hp: 100, maxHp: 100, damage: 1, reward: { coins: 500, diamonds: 1, xp: 200 }, unlocked: true, defeated: false },
  { id: 'orc', name: 'Orc Warlord', emoji: '👺', hp: 500, maxHp: 500, damage: 5, reward: { coins: 2500, diamonds: 3, xp: 1000 }, unlocked: false, defeated: false },
  { id: 'demon', name: 'Fire Demon', emoji: '😈', hp: 2000, maxHp: 2000, damage: 20, reward: { coins: 10000, diamonds: 10, xp: 5000 }, unlocked: false, defeated: false },
  { id: 'dragon_boss', name: 'Ancient Dragon', emoji: '🐲', hp: 10000, maxHp: 10000, damage: 100, reward: { coins: 50000, diamonds: 50, xp: 25000 }, unlocked: false, defeated: false },
];

export const INITIAL_QUESTS: Quest[] = [
  { id: 'daily_clicks', name: 'Daily Clicker', description: 'Make 500 clicks today', type: 'click', target: 500, current: 0, completed: false, reward: { type: 'coins', amount: 1000 } },
  { id: 'earn_coins', name: 'Coin Collector', description: 'Earn 10,000 coins', type: 'earn', target: 10000, current: 0, completed: false, reward: { type: 'diamonds', amount: 2 } },
  { id: 'buy_upgrade', name: 'Upgrade Master', description: 'Buy 3 upgrades', type: 'upgrade', target: 3, current: 0, completed: false, reward: { type: 'xp', amount: 1000 } },
  { id: 'defeat_boss', name: 'Boss Slayer', description: 'Defeat 1 boss', type: 'boss', target: 1, current: 0, completed: false, reward: { type: 'diamonds', amount: 5 } },
];

export const RARITY_COLORS: Record<string, string> = {
  common: '#6b7280',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
  mythic: '#ec4899',
  rainbow: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
  godly: '#fde047',
  expensive: '#dc2626'
};

export const CLICK_SOUNDS: Record<string, string> = {
  common: 'click1.mp3',
  rare: 'click2.mp3',
  epic: 'click3.mp3',
  legendary: 'click4.mp3',
  mythic: 'click5.mp3',
  rainbow: 'click6.mp3',
  godly: 'click7.mp3'
};

export const DAILY_REWARDS = [
  { day: 1, coins: 100, diamonds: 0, xp: 50 },
  { day: 2, coins: 250, diamonds: 1, xp: 100 },
  { day: 3, coins: 500, diamonds: 1, xp: 200 },
  { day: 4, coins: 1000, diamonds: 2, xp: 400 },
  { day: 5, coins: 2500, diamonds: 3, xp: 800 },
  { day: 6, coins: 5000, diamonds: 5, xp: 1600 },
  { day: 7, coins: 10000, diamonds: 10, xp: 3200 },
];

export const XP_TO_LEVEL = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const PRESTIGE_REQUIREMENT = 1000000; // 1M coins to prestige
export const PRESTIGE_MULTIPLIER = 0.1; // +10% per prestige
import { useState, useEffect, useCallback } from 'react';
import { GameState, DamageText, Particle, MinigameScore } from '../types/game';
import { INITIAL_SKINS, INITIAL_UPGRADES, INITIAL_AUTO_CLICKERS, INITIAL_ACHIEVEMENTS, INITIAL_BOSSES, INITIAL_QUESTS, XP_TO_LEVEL } from '../data/gameData';

const STORAGE_KEY = 'dragon_clicker_save';

const createInitialState = (): GameState => ({
  // Core Stats
  score: 0,
  coins: 0,
  diamonds: 0,
  xp: 0,
  level: 1,
  prestige: 0,
  
  // Multipliers
  clickMultiplier: 1,
  globalMultiplier: 1,
  prestigeMultiplier: 1,
  
  // Auto Systems
  autoClickerCps: 0,
  offlineEarnings: 0,
  lastSaveTime: Date.now(),
  
  // Current Equipment
  currentSkin: 'dragon_basic',
  currentBackground: 'default',
  
  // Collections
  skins: INITIAL_SKINS,
  upgrades: INITIAL_UPGRADES,
  autoClickers: INITIAL_AUTO_CLICKERS,
  achievements: INITIAL_ACHIEVEMENTS,
  bosses: INITIAL_BOSSES,
  quests: INITIAL_QUESTS,
  
  // Daily Systems
  lastDailyReward: 0,
  dailyStreak: 0,
  dailyChestClaimed: false,
  
  // Settings
  soundEnabled: true,
  musicEnabled: true,
  particlesEnabled: true,
  
  // Statistics
  totalClicks: 0,
  totalEarned: 0,
  timePlayed: 0,
  bossesDefeated: 0,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [damageTexts, setDamageTexts] = useState<DamageText[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [minigameScores, setMinigameScores] = useState<MinigameScore>({
    flappyBest: 0,
    memoryBest: 0,
    reactionBest: 0,
    mathBest: 0,
  });

  // Save game state to localStorage
  const saveGame = useCallback(() => {
    const saveData = {
      ...gameState,
      lastSaveTime: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    localStorage.setItem('minigame_scores', JSON.stringify(minigameScores));
  }, [gameState, minigameScores]);

  // Load game state from localStorage
  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedMinigames = localStorage.getItem('minigame_scores');
      
      if (saved) {
        const parsedData = JSON.parse(saved);
        setGameState(parsedData);
        
        // Calculate offline earnings
        const offlineTime = Date.now() - parsedData.lastSaveTime;
        const offlineHours = offlineTime / (1000 * 60 * 60);
        const offlineEarnings = Math.floor(parsedData.autoClickerCps * offlineHours * 3600 * parsedData.globalMultiplier);
        
        if (offlineEarnings > 0) {
          setGameState(prev => ({
            ...prev,
            coins: prev.coins + offlineEarnings,
            offlineEarnings: offlineEarnings
          }));
        }
      }
      
      if (savedMinigames) {
        setMinigameScores(JSON.parse(savedMinigames));
      }
    } catch (error) {
      console.error('Failed to load save data:', error);
    }
  }, []);

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(saveGame, 10000);
    return () => clearInterval(interval);
  }, [saveGame]);

  // Load on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // Auto clicker effect
  useEffect(() => {
    if (gameState.autoClickerCps > 0) {
      const interval = setInterval(() => {
        const clickPower = gameState.clickMultiplier * gameState.globalMultiplier * gameState.prestigeMultiplier;
        const earnings = gameState.autoClickerCps * clickPower;
        
        setGameState(prev => ({
          ...prev,
          score: prev.score + earnings,
          coins: prev.coins + earnings,
          totalEarned: prev.totalEarned + earnings
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.autoClickerCps, gameState.clickMultiplier, gameState.globalMultiplier, gameState.prestigeMultiplier]);

  // Click function
  const handleClick = useCallback((x: number, y: number) => {
    const currentSkin = gameState.skins.find(s => s.id === gameState.currentSkin);
    const skinMultiplier = currentSkin?.clickMultiplier || 1;
    const clickPower = gameState.clickMultiplier * gameState.globalMultiplier * gameState.prestigeMultiplier * skinMultiplier;
    
    setGameState(prev => {
      const newState = {
        ...prev,
        score: prev.score + clickPower,
        coins: prev.coins + clickPower,
        totalClicks: prev.totalClicks + 1,
        totalEarned: prev.totalEarned + clickPower,
        xp: prev.xp + 1
      };

      // Level up check
      const xpRequired = XP_TO_LEVEL(newState.level);
      if (newState.xp >= xpRequired) {
        newState.xp -= xpRequired;
        newState.level += 1;
      }

      return newState;
    });

    // Add damage text
    const damageText: DamageText = {
      id: Date.now().toString(),
      damage: clickPower,
      x: x + (Math.random() - 0.5) * 50,
      y: y + (Math.random() - 0.5) * 50,
      timestamp: Date.now(),
      rarity: currentSkin?.rarity || 'common'
    };

    setDamageTexts(prev => [...prev, damageText]);

    // Add particles if enabled
    if (gameState.particlesEnabled) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 5; i++) {
        newParticles.push({
          id: `${Date.now()}-${i}`,
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4 - 2,
          size: Math.random() * 6 + 2,
          color: currentSkin?.rarity || 'common',
          life: 0,
          maxLife: 60
        });
      }
      setParticles(prev => [...prev, ...newParticles]);
    }

    // Check achievements
    checkAchievements(gameState.totalClicks + 1, gameState.totalEarned + clickPower);
  }, [gameState.currentSkin, gameState.skins, gameState.clickMultiplier, gameState.globalMultiplier, gameState.prestigeMultiplier, gameState.particlesEnabled, gameState.totalClicks, gameState.totalEarned]);

  // Buy skin
  const buySkin = useCallback((skinId: string) => {
    const skin = gameState.skins.find(s => s.id === skinId);
    if (!skin || skin.owned) return false;

    const canAfford = gameState[skin.currency] >= skin.price;
    if (!canAfford) return false;

    setGameState(prev => ({
      ...prev,
      [skin.currency]: prev[skin.currency] - skin.price,
      skins: prev.skins.map(s => 
        s.id === skinId ? { ...s, owned: true } : s
      )
    }));

    return true;
  }, [gameState.skins, gameState.coins, gameState.diamonds]);

  // Equip skin
  const equipSkin = useCallback((skinId: string) => {
    const skin = gameState.skins.find(s => s.id === skinId);
    if (!skin || !skin.owned) return false;

    setGameState(prev => ({ ...prev, currentSkin: skinId }));
    return true;
  }, [gameState.skins]);

  // Buy upgrade
  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.currentLevel >= upgrade.maxLevel) return false;

    const price = upgrade.price * Math.pow(2, upgrade.currentLevel);
    const canAfford = gameState[upgrade.currency] >= price;
    if (!canAfford) return false;

    setGameState(prev => ({
      ...prev,
      [upgrade.currency]: prev[upgrade.currency] - price,
      upgrades: prev.upgrades.map(u => 
        u.id === upgradeId ? { ...u, currentLevel: u.currentLevel + 1 } : u
      ),
      clickMultiplier: upgradeId.includes('click') ? 
        prev.clickMultiplier * upgrade.multiplier : prev.clickMultiplier,
      globalMultiplier: upgradeId.includes('global') ? 
        prev.globalMultiplier * upgrade.multiplier : prev.globalMultiplier
    }));

    return true;
  }, [gameState.upgrades, gameState.coins, gameState.diamonds]);

  // Buy auto clicker
  const buyAutoClicker = useCallback((autoClickerId: string) => {
    const autoClicker = gameState.autoClickers.find(a => a.id === autoClickerId);
    if (!autoClicker || autoClicker.owned >= autoClicker.maxOwned) return false;

    const price = autoClicker.price * Math.pow(2, autoClicker.owned);
    const canAfford = gameState[autoClicker.currency] >= price;
    if (!canAfford) return false;

    setGameState(prev => ({
      ...prev,
      [autoClicker.currency]: prev[autoClicker.currency] - price,
      autoClickers: prev.autoClickers.map(a => 
        a.id === autoClickerId ? { ...a, owned: a.owned + 1 } : a
      ),
      autoClickerCps: prev.autoClickerCps + autoClicker.cps
    }));

    return true;
  }, [gameState.autoClickers, gameState.coins, gameState.diamonds]);

  // Check achievements
  const checkAchievements = useCallback((totalClicks: number, totalEarned: number) => {
    setGameState(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.completed) return achievement;

        let progress = achievement.currentProgress;
        if (achievement.id === 'first_click' || achievement.id === 'hundred_clicks' || achievement.id === 'thousand_clicks') {
          progress = totalClicks;
        } else if (achievement.id === 'millionaire') {
          progress = totalEarned;
        }

        const completed = progress >= achievement.requirement;
        if (completed && !achievement.completed) {
          // Award achievement reward
          setTimeout(() => {
            setGameState(current => {
              const rewardType = achievement.reward.type;
              const rewardAmount = achievement.reward.amount;
              
              switch (rewardType) {
                case 'coins':
                  return { ...current, coins: current.coins + rewardAmount };
                case 'diamonds':
                  return { ...current, diamonds: current.diamonds + rewardAmount };
                case 'xp':
                  return { ...current, xp: current.xp + rewardAmount };
                default:
                  return current;
              }
            });
          }, 0);
        }

        return {
          ...achievement,
          currentProgress: progress,
          completed
        };
      })
    }));
  }, []);

  // Clean up effects
  useEffect(() => {
    const cleanup = () => {
      setDamageTexts(prev => prev.filter(text => Date.now() - text.timestamp < 1000));
      setParticles(prev => prev.filter(particle => particle.life < particle.maxLife).map(particle => ({
        ...particle,
        life: particle.life + 1,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.1
      })));
    };

    const interval = setInterval(cleanup, 16);
    return () => clearInterval(interval);
  }, []);

  return {
    gameState,
    damageTexts,
    particles,
    minigameScores,
    setMinigameScores,
    handleClick,
    buySkin,
    equipSkin,
    buyUpgrade,
    buyAutoClicker,
    saveGame,
    loadGame,
    setGameState
  };
};
// Game Types Definition
export type RarityType = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'rainbow' | 'godly' | 'expensive';

export interface Skin {
  id: string;
  name: string;
  rarity: RarityType;
  emoji: string;
  price: number;
  currency: 'coins' | 'diamonds';
  clickMultiplier: number;
  clickSound?: string;
  effect?: string;
  unlocked: boolean;
  owned: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'diamonds';
  multiplier: number;
  maxLevel: number;
  currentLevel: number;
  unlocked: boolean;
}

export interface AutoClicker {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'diamonds';
  cps: number; // clicks per second
  owned: number;
  maxOwned: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  currentProgress: number;
  completed: boolean;
  reward: {
    type: 'coins' | 'diamonds' | 'xp' | 'multiplier';
    amount: number;
  };
}

export interface Boss {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  damage: number;
  reward: {
    coins: number;
    diamonds: number;
    xp: number;
  };
  unlocked: boolean;
  defeated: boolean;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'click' | 'earn' | 'upgrade' | 'boss' | 'time';
  target: number;
  current: number;
  completed: boolean;
  reward: {
    type: 'coins' | 'diamonds' | 'xp';
    amount: number;
  };
  timeLimit?: number;
}

export interface GameState {
  // Core Stats
  score: number;
  coins: number;
  diamonds: number;
  xp: number;
  level: number;
  prestige: number;
  
  // Multipliers
  clickMultiplier: number;
  globalMultiplier: number;
  prestigeMultiplier: number;
  
  // Auto Systems
  autoClickerCps: number;
  offlineEarnings: number;
  lastSaveTime: number;
  
  // Current Equipment
  currentSkin: string;
  currentBackground: string;
  
  // Collections
  skins: Skin[];
  upgrades: Upgrade[];
  autoClickers: AutoClicker[];
  achievements: Achievement[];
  bosses: Boss[];
  quests: Quest[];
  
  // Daily Systems
  lastDailyReward: number;
  dailyStreak: number;
  dailyChestClaimed: boolean;
  
  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  particlesEnabled: boolean;
  
  // Statistics
  totalClicks: number;
  totalEarned: number;
  timePlayed: number;
  bossesDefeated: number;
}

export interface DamageText {
  id: string;
  damage: number;
  x: number;
  y: number;
  timestamp: number;
  rarity: RarityType;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface MinigameScore {
  flappyBest: number;
  memoryBest: number;
  reactionBest: number;
  mathBest: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  prestige: number;
  timestamp: number;
}
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Game Design System - Dragon Clicker RPG */

@layer base {
  :root {
    /* Game Background */
    --background: 220 13% 9%;
    --foreground: 210 40% 98%;

    /* Game Cards */
    --card: 217.2 32.6% 17.5%;
    --card-foreground: 210 40% 98%;

    --popover: 217.2 32.6% 17.5%;
    --popover-foreground: 210 40% 98%;

    /* Game Colors */
    --primary: 42 96% 65%;
    --primary-foreground: 220 13% 9%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 268 83% 58%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 42 96% 65%;

    /* Game Specific Colors */
    --game-common: 120 13% 60%;
    --game-rare: 213 95% 68%;
    --game-epic: 268 83% 58%;
    --game-legendary: 33 96% 56%;
    --game-mythic: 320 91% 68%;
    --game-rainbow: linear-gradient(90deg, hsl(0 100% 70%), hsl(60 100% 70%), hsl(120 100% 70%), hsl(180 100% 70%), hsl(240 100% 70%), hsl(300 100% 70%));
    --game-godly: 60 100% 85%;
    
    /* Game Effects */
    --glow-gold: 0 0 20px hsl(42 96% 65% / 0.5);
    --glow-purple: 0 0 20px hsl(268 83% 58% / 0.5);
    --glow-blue: 0 0 20px hsl(213 95% 68% / 0.5);
    
    /* Game Gradients */
    --gradient-dragon: linear-gradient(135deg, hsl(42 96% 65%), hsl(33 96% 56%));
    --gradient-magic: linear-gradient(135deg, hsl(268 83% 58%), hsl(320 91% 68%));
    --gradient-power: linear-gradient(135deg, hsl(213 95% 68%), hsl(268 83% 58%));
    
    /* Game Animations */
    --bounce-click: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --glow-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    --radius: 0.75rem;

    --sidebar-background: 0 0% 98%;

    --sidebar-foreground: 240 5.3% 26.1%;

    --sidebar-primary: 240 5.9% 10%;

    --sidebar-primary-foreground: 0 0% 98%;

    --sidebar-accent: 240 4.8% 95.9%;

    --sidebar-accent-foreground: 240 5.9% 10%;

    --sidebar-border: 220 13% 91%;

    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  /* Game Specific Classes */
  .rarity-common { @apply text-stone-400 border-stone-400; }
  .rarity-rare { @apply text-blue-400 border-blue-400; }
  .rarity-epic { @apply text-purple-400 border-purple-400; }
  .rarity-legendary { @apply text-orange-400 border-orange-400; }
  .rarity-mythic { @apply text-pink-400 border-pink-400; }
  .rarity-godly { @apply text-yellow-300 border-yellow-300; }
  
  /* Click Effects */
  .click-bounce {
    animation: clickBounce 0.3s var(--bounce-click);
  }
  
  .damage-text {
    animation: damageFloat 1s ease-out forwards;
  }
  
  .particle-effect {
    animation: particleFloat 1.5s ease-out forwards;
  }
  
  /* Glow Effects */
  .glow-gold { box-shadow: var(--glow-gold); }
  .glow-purple { box-shadow: var(--glow-purple); }
  .glow-blue { box-shadow: var(--glow-blue); }
  
  /* Button Variants */
  .btn-game {
    @apply relative overflow-hidden transition-all duration-300 transform hover:scale-105;
  }
  
  .btn-game:hover {
    box-shadow: 0 0 25px hsl(var(--primary) / 0.4);
  }
  
  /* Rainbow Text Effect */
  .text-rainbow {
    background: var(--game-rainbow);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: rainbowShift 3s ease-in-out infinite;
  }
}

@layer utilities {
  /* Game Animations */
  @keyframes clickBounce {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }
  
  @keyframes damageFloat {
    0% { 
      opacity: 1; 
      transform: translateY(0) scale(1);
    }
    100% { 
      opacity: 0; 
      transform: translateY(-60px) scale(1.2);
    }
  }
  
  @keyframes particleFloat {
    0% { 
      opacity: 1; 
      transform: translateY(0) scale(0.5);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-30px) scale(1);
    }
    100% { 
      opacity: 0; 
      transform: translateY(-80px) scale(0.2);
    }
  }
  
  @keyframes rainbowShift {
    0%, 100% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(180deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
    40%, 43% { transform: translate3d(0, -20px, 0); }
    70% { transform: translate3d(0, -10px, 0); }
    90% { transform: translate3d(0, -4px, 0); }
  }
}
import React from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { DragonClicker } from '@/components/game/DragonClicker';
import { ShopPanel } from '@/components/game/ShopPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Game Content */}
      <div className="relative z-10 space-y-8 pb-8">
        {/* Game Header with Stats */}
        <GameHeader />
        
        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4">
          {/* Left Side - Clicker */}
          <div className="flex-1 flex flex-col items-center space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Dragon Clicker RPG
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Click the dragon to earn coins and become the ultimate dragon master!
              </p>
            </div>
            
            <DragonClicker />
            
            <div className="text-center text-sm text-muted-foreground">
              <p>💡 Buy skins and upgrades to increase your power!</p>
              <p>🏆 Complete achievements to earn rewards!</p>
            </div>
          </div>
          
          {/* Right Side - Shop */}
          <div className="flex-1 max-w-2xl">
            <ShopPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export defaul

import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				game: {
					common: 'hsl(var(--game-common))',
					rare: 'hsl(var(--game-rare))',
					epic: 'hsl(var(--game-epic))',
					legendary: 'hsl(var(--game-legendary))',
					mythic: 'hsl(var(--game-mythic))',
					godly: 'hsl(var(--game-godly))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
