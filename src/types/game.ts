import BigNumber from 'bignumber.js';

export interface Powerup {
  id: string;
  name: string;
  description: string;
  cost: BigNumber;
  count: BigNumber;
  powerIncrease: BigNumber;
  tier: number;
}

export interface VibeProducer {
  id: string;
  name: string;
  description: string;
  baseCost: BigNumber;
  baseValue: BigNumber;
  count: BigNumber;
  interval: number;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  components: {
    processingUnit: {
      id: string;
      name: string;
      description: string;
      count: BigNumber;
      level: number;
    };
    powerCore: {
      id: string;
      name: string;
      description: string;
      count: BigNumber;
      level: number;
    };
  };
}

export interface GameState {
  vibe: BigNumber;
  clickPower: BigNumber;
  vibePerSecond: BigNumber;
  powerups: Powerup[];
  vibeProducers: VibeProducer[];
  aiAgent: AIAgent;
}

export interface Generator {
  id: string;
  name: string;
  description: string;
  baseValue: BigNumber;
  interval: number;
  level: number;
} 