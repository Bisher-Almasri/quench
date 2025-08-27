import React from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

export type PlantSVGProps = {
  size?: number;
  color?: string;
  stage: 'seed' | 'sprout' | 'small' | 'big' | 'dead';
  type?: 'test' | 'basic' | 'rare' | 'epic';
};

export const SeedSVG: React.FC<PlantSVGProps> = ({ size = 32, color = '#8B4513' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="seedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B4513" />
        <Stop offset="100%" stopColor="#A0522D" />
      </LinearGradient>
    </Defs>
    <Circle cx="16" cy="16" r="8" fill="url(#seedGradient)" />
    <Circle cx="16" cy="16" r="4" fill="#654321" />
  </Svg>
);

export const SproutSVG: React.FC<PlantSVGProps> = ({ size = 32, color = '#228B22' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="sproutGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#228B22" />
        <Stop offset="100%" stopColor="#32CD32" />
      </LinearGradient>
    </Defs>
    <Path d="M16 28 L16 20" stroke="#8B4513" strokeWidth="2" fill="none" />
    <Path d="M16 20 Q12 18 10 20 Q12 22 16 20" fill="url(#sproutGradient)" />
    <Path d="M16 20 Q20 18 22 20 Q20 22 16 20" fill="url(#sproutGradient)" />
    <Circle cx="16" cy="28" r="3" fill="#8B4513" />
  </Svg>
);

export const SmallPlantSVG: React.FC<PlantSVGProps> = ({ size = 32, color = '#228B22' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="smallPlantGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#228B22" />
        <Stop offset="100%" stopColor="#32CD32" />
      </LinearGradient>
    </Defs>
    <Path d="M16 28 L16 16" stroke="#8B4513" strokeWidth="2" fill="none" />
    <Path d="M16 16 Q12 14 10 16 Q12 18 16 16" fill="url(#smallPlantGradient)" />
    <Path d="M16 16 Q20 14 22 16 Q20 18 16 16" fill="url(#smallPlantGradient)" />
    <Path d="M16 18 Q14 16 12 18 Q14 20 16 18" fill="url(#smallPlantGradient)" />
    <Path d="M16 18 Q18 16 20 18 Q18 20 16 18" fill="url(#smallPlantGradient)" />
    <Path d="M12 28 L20 28 L22 32 L10 32 Z" fill="#CD853F" />
  </Svg>
);

export const BigPlantSVG: React.FC<PlantSVGProps> = ({ size = 32, color = '#228B22', type = 'basic' }) => {
  const getFlowerColor = () => {
    switch (type) {
      case 'test': return '#FF6B6B';
      case 'basic': return '#FFD700';
      case 'rare': return '#9370DB';
      case 'epic': return '#FF1493';
      default: return '#FFD700';
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id="bigPlantGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <Stop offset="0%" stopColor="#228B22" />
          <Stop offset="100%" stopColor="#32CD32" />
        </LinearGradient>
        <LinearGradient id="flowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={getFlowerColor()} />
          <Stop offset="100%" stopColor="#FFA500" />
        </LinearGradient>
      </Defs>
      <Path d="M16 28 L16 12" stroke="#8B4513" strokeWidth="2" fill="none" />
      <Path d="M16 12 Q10 10 8 12 Q10 14 16 12" fill="url(#bigPlantGradient)" />
      <Path d="M16 12 Q22 10 24 12 Q22 14 16 12" fill="url(#bigPlantGradient)" />
      <Path d="M16 14 Q12 12 10 14 Q12 16 16 14" fill="url(#bigPlantGradient)" />
      <Path d="M16 14 Q20 12 22 14 Q20 16 16 14" fill="url(#bigPlantGradient)" />
      <Circle cx="16" cy="10" r="3" fill="url(#flowerGradient)" />
      <Circle cx="16" cy="10" r="1.5" fill="#FFD700" />
      <Circle cx="14" cy="8" r="1" fill="url(#flowerGradient)" />
      <Circle cx="18" cy="8" r="1" fill="url(#flowerGradient)" />
      <Circle cx="14" cy="12" r="1" fill="url(#flowerGradient)" />
      <Circle cx="18" cy="12" r="1" fill="url(#flowerGradient)" />
      <Path d="M10 28 L22 28 L24 32 L8 32 Z" fill="#CD853F" />
    </Svg>
  );
};

export const DeadPlantSVG: React.FC<PlantSVGProps> = ({ size = 32, color = '#8B4513' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="deadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B4513" />
        <Stop offset="100%" stopColor="#A0522D" />
      </LinearGradient>
    </Defs>
    <Path d="M16 28 L16 12" stroke="#8B4513" strokeWidth="2" fill="none" strokeDasharray="2,2" />
    <Path d="M16 12 Q12 10 10 12" stroke="#8B4513" strokeWidth="1" fill="none" />
    <Path d="M16 12 Q20 10 22 12" stroke="#8B4513" strokeWidth="1" fill="none" />
    <Circle cx="16" cy="10" r="2" fill="none" stroke="#8B4513" strokeWidth="1" />
    <Path d="M10 28 L22 28 L24 32 L8 32 Z" fill="#CD853F" />
  </Svg>
);

export const PlantSVG: React.FC<PlantSVGProps> = ({ stage, type = 'basic', size = 32, color }) => {
  switch (stage) {
    case 'seed':
      return <SeedSVG size={size} color={color} stage={stage} type={type} />;
    case 'sprout':
      return <SproutSVG size={size} color={color} stage={stage} type={type} />;
    case 'small':
      return <SmallPlantSVG size={size} color={color} stage={stage} type={type} />;
    case 'big':
      return <BigPlantSVG size={size} color={color} stage={stage} type={type} />;
    case 'dead':
      return <DeadPlantSVG size={size} color={color} stage={stage} type={type} />;
    default:
      return <SeedSVG size={size} color={color} stage={stage} type={type} />;
  }
};

export const TestPlantSVG: React.FC<PlantSVGProps> = ({ size = 32, stage }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="testGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF6B6B" />
        <Stop offset="100%" stopColor="#FF8E8E" />
      </LinearGradient>
    </Defs>
    {stage === 'seed' && (
      <G>
        <Circle cx="16" cy="16" r="8" fill="url(#testGradient)" />
        <Circle cx="16" cy="16" r="4" fill="#FF4444" />
      </G>
    )}
    {stage === 'sprout' && (
      <G>
        <Path d="M16 28 L16 20" stroke="#8B4513" strokeWidth="2" fill="none" />
        <Path d="M16 20 Q12 18 10 20 Q12 22 16 20" fill="url(#testGradient)" />
        <Path d="M16 20 Q20 18 22 20 Q20 22 16 20" fill="url(#testGradient)" />
        <Circle cx="16" cy="28" r="3" fill="#8B4513" />
      </G>
    )}
    {stage === 'small' && (
      <G>
        <Path d="M16 28 L16 16" stroke="#8B4513" strokeWidth="2" fill="none" />
        <Path d="M16 16 Q12 14 10 16 Q12 18 16 16" fill="url(#testGradient)" />
        <Path d="M16 16 Q20 14 22 16 Q20 18 16 16" fill="url(#testGradient)" />
        <Path d="M16 18 Q14 16 12 18 Q14 20 16 18" fill="url(#testGradient)" />
        <Path d="M16 18 Q18 16 20 18 Q18 20 16 18" fill="url(#testGradient)" />
        <Path d="M12 28 L20 28 L22 32 L10 32 Z" fill="#CD853F" />
      </G>
    )}
    {stage === 'big' && (
      <G>
        <Path d="M16 28 L16 12" stroke="#8B4513" strokeWidth="2" fill="none" />
        <Path d="M16 12 Q10 10 8 12 Q10 14 16 12" fill="url(#testGradient)" />
        <Path d="M16 12 Q22 10 24 12 Q22 14 16 12" fill="url(#testGradient)" />
        <Path d="M16 14 Q12 12 10 14 Q12 16 16 14" fill="url(#testGradient)" />
        <Path d="M16 14 Q20 12 22 14 Q20 16 16 14" fill="url(#testGradient)" />
        <Circle cx="16" cy="10" r="3" fill="#FF6B6B" />
        <Circle cx="16" cy="10" r="1.5" fill="#FFD700" />
        <Path d="M10 28 L22 28 L24 32 L8 32 Z" fill="#CD853F" />
      </G>
    )}
    {stage === 'dead' && (
      <G>
        <Path d="M16 28 L16 12" stroke="#8B4513" strokeWidth="2" fill="none" strokeDasharray="2,2" />
        <Path d="M16 12 Q12 10 10 12" stroke="#8B4513" strokeWidth="1" fill="none" />
        <Path d="M16 12 Q20 10 22 12" stroke="#8B4513" strokeWidth="1" fill="none" />
        <Circle cx="16" cy="10" r="2" fill="none" stroke="#8B4513" strokeWidth="1" />
        <Path d="M10 28 L22 28 L24 32 L8 32 Z" fill="#CD853F" />
      </G>
    )}
  </Svg>
);

export const RarePlantSVG: React.FC<PlantSVGProps> = ({ size = 32, stage }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="rareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#9370DB" />
        <Stop offset="100%" stopColor="#BA55D3" />
      </LinearGradient>
    </Defs>
    {stage === 'big' && (
      <G>
        <Path d="M16 28 L16 12" stroke="#8B4513" strokeWidth="2" fill="none" />
        <Path d="M16 12 Q10 10 8 12 Q10 14 16 12" fill="url(#rareGradient)" />
        <Path d="M16 12 Q22 10 24 12 Q22 14 16 12" fill="url(#rareGradient)" />
        <Path d="M16 14 Q12 12 10 14 Q12 16 16 14" fill="url(#rareGradient)" />
        <Path d="M16 14 Q20 12 22 14 Q20 16 16 14" fill="url(#rareGradient)" />
        <Circle cx="16" cy="10" r="4" fill="#9370DB" />
        <Circle cx="16" cy="10" r="2" fill="#FFD700" />
        <Circle cx="16" cy="10" r="1" fill="#FFFFFF" />
        <Circle cx="12" cy="8" r="0.5" fill="#FFD700" />
        <Circle cx="20" cy="8" r="0.5" fill="#FFD700" />
        <Circle cx="12" cy="12" r="0.5" fill="#FFD700" />
        <Circle cx="20" cy="12" r="0.5" fill="#FFD700" />
        <Path d="M10 28 L22 28 L24 32 L8 32 Z" fill="#CD853F" />
      </G>
    )}
    {stage !== 'big' && (
      <PlantSVG stage={stage} type="rare" size={size} />
    )}
  </Svg>
);

export const EpicPlantSVG: React.FC<PlantSVGProps> = ({ size = 32, stage }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="epicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF1493" />
        <Stop offset="100%" stopColor="#FF69B4" />
      </LinearGradient>
      <LinearGradient id="epicGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFD700" />
        <Stop offset="100%" stopColor="#FFA500" />
      </LinearGradient>
    </Defs>
    {stage === 'big' && (
      <G>
        <Path d="M16 28 L16 12" stroke="#8B4513" strokeWidth="2" fill="none" />
        <Path d="M16 12 Q10 10 8 12 Q10 14 16 12" fill="url(#epicGradient)" />
        <Path d="M16 12 Q22 10 24 12 Q22 14 16 12" fill="url(#epicGradient)" />
        <Path d="M16 14 Q12 12 10 14 Q12 16 16 14" fill="url(#epicGradient)" />
        <Path d="M16 14 Q20 12 22 14 Q20 16 16 14" fill="url(#epicGradient)" />
        <Circle cx="16" cy="10" r="5" fill="url(#epicGradient)" />
        <Circle cx="16" cy="10" r="3" fill="url(#epicGold)" />
        <Circle cx="16" cy="10" r="1.5" fill="#FFFFFF" />
        <Circle cx="14" cy="6" r="1.5" fill="url(#epicGradient)" />
        <Circle cx="18" cy="6" r="1.5" fill="url(#epicGradient)" />
        <Circle cx="14" cy="14" r="1.5" fill="url(#epicGradient)" />
        <Circle cx="18" cy="14" r="1.5" fill="url(#epicGradient)" />
        <Circle cx="10" cy="10" r="1.5" fill="url(#epicGradient)" />
        <Circle cx="22" cy="10" r="1.5" fill="url(#epicGradient)" />
        <Circle cx="12" cy="8" r="0.8" fill="url(#epicGold)" />
        <Circle cx="20" cy="8" r="0.8" fill="url(#epicGold)" />
        <Circle cx="12" cy="12" r="0.8" fill="url(#epicGold)" />
        <Circle cx="20" cy="12" r="0.8" fill="url(#epicGold)" />
        <Path d="M10 28 L22 28 L24 32 L8 32 Z" fill="#CD853F" />
      </G>
    )}
    {stage !== 'big' && (
      <PlantSVG stage={stage} type="epic" size={size} />
    )}
  </Svg>
);

export const PlantSVGComponent: React.FC<PlantSVGProps> = ({ type = 'basic', stage, size = 32, color }) => {
  switch (type) {
    case 'test':
      return <TestPlantSVG stage={stage} size={size} />;
    case 'rare':
      return <RarePlantSVG stage={stage} size={size} />;
    case 'epic':
      return <EpicPlantSVG stage={stage} size={size} />;
    default:
      return <PlantSVG stage={stage} type={type} size={size} color={color} />;
  }
};
