import { useState, useEffect, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { VibeProducer, AIAgent, Generator } from '../types/game';
import { formatVibeWithSi, formatWithSi, calculateCost } from '../utils/formatNumber';

interface AutoGeneratorsProps {
  vibe: BigNumber;
  setVibe: (value: BigNumber | ((prev: BigNumber) => BigNumber)) => void;
  clickPower: BigNumber;
  setVibePerSecond: (value: BigNumber) => void;
  aiAgent: AIAgent;
  setAiAgent: (value: AIAgent) => void;
  vibeProducers: VibeProducer[];
  setVibeProducers: (value: VibeProducer[] | ((prev: VibeProducer[]) => VibeProducer[])) => void;
}

interface AIAgentComponent {
  id: string;
  name: string;
  description: string;
  baseCost: BigNumber;
  count: BigNumber;
  levels: {
    level: number;
    value: number;
    name: string;
    description: string;
    upgradeCost: BigNumber;
  }[];
}

interface AIAgentData {
  id: string;
  name: string;
  description: string;
  components: {
    processingUnit: AIAgentComponent;
    powerCore: AIAgentComponent;
  };
}

// AI Agent data structure
export const AI_AGENT: AIAgentData = {
  id: 'ai_agent',
  name: 'AI Agent',
  description: 'Automatically clicks the Vibe button for you',
  components: {
    processingUnit: {
      id: 'processing_unit',
      name: 'Processing Unit',
      description: 'Increases clicks per second',
      baseCost: new BigNumber(10000),
      count: new BigNumber(0),
      levels: [
        {
          level: 1,
          value: 0.2, // clicks per second
          name: 'Basic CPU',
          description: 'Processes 1 click every 5 seconds',
          upgradeCost: new BigNumber(50000)
        },
        {
          level: 2,
          value: 0.33, // clicks per second
          name: 'Multi-Core CPU',
          description: 'Processes 1 click every 3 seconds',
          upgradeCost: new BigNumber(250000)
        },
        {
          level: 3,
          value: 1, // clicks per second
          name: 'Quantum CPU',
          description: 'Processes 1 click per second',
          upgradeCost: new BigNumber(1000000)
        },
        {
          level: 4,
          value: 2, // clicks per second
          name: 'Neural Network',
          description: 'Processes 2 clicks per second',
          upgradeCost: new BigNumber(5000000)
        },
        {
          level: 5,
          value: 5, // clicks per second
          name: 'Singularity Core',
          description: 'Processes 5 clicks per second',
          upgradeCost: new BigNumber(0)
        }
      ]
    },
    powerCore: {
      id: 'power_core',
      name: 'Power Core',
      description: 'Multiplies click power',
      baseCost: new BigNumber(15000),
      count: new BigNumber(0),
      levels: [
        {
          level: 1,
          value: 1.5, // multiplier
          name: 'Basic Core',
          description: '1.5x click power multiplier',
          upgradeCost: new BigNumber(75000)
        },
        {
          level: 2,
          value: 2, // multiplier
          name: 'Enhanced Core',
          description: '2x click power multiplier',
          upgradeCost: new BigNumber(375000)
        },
        {
          level: 3,
          value: 3, // multiplier
          name: 'Supercharged Core',
          description: '3x click power multiplier',
          upgradeCost: new BigNumber(1500000)
        },
        {
          level: 4,
          value: 5, // multiplier
          name: 'Fusion Core',
          description: '5x click power multiplier',
          upgradeCost: new BigNumber(7500000)
        },
        {
          level: 5,
          value: 10, // multiplier
          name: 'Singularity Core',
          description: '10x click power multiplier',
          upgradeCost: new BigNumber(0)
        }
      ]
    }
  }
};

// Vibe Producers data structure
const VIBE_PRODUCERS: VibeProducer[] = [
  {
    id: 'intern',
    name: 'Vibe Coder Intern',
    description: 'Produces 2 Vibe every 10 seconds',
    baseCost: new BigNumber(300),
    baseValue: new BigNumber(2),
    count: new BigNumber(0),
    interval: 10000, // 10 seconds in milliseconds
  },
  {
    id: 'junior_dev',
    name: 'Junior Vibe Developer',
    description: 'Produces 5 Vibe every 10 seconds',
    baseCost: new BigNumber(1000),
    baseValue: new BigNumber(5),
    count: new BigNumber(0),
    interval: 10000, // 10 seconds in milliseconds
  },
  {
    id: 'senior_dev',
    name: 'Senior Vibe Developer',
    description: 'Produces 15 Vibe every 10 seconds',
    baseCost: new BigNumber(5000),
    baseValue: new BigNumber(15),
    count: new BigNumber(0),
    interval: 10000, // 10 seconds in milliseconds
  },
  {
    id: 'tech_lead',
    name: 'Vibe Tech Lead',
    description: 'Produces 50 Vibe every 10 seconds',
    baseCost: new BigNumber(20000),
    baseValue: new BigNumber(50),
    count: new BigNumber(0),
    interval: 10000, // 10 seconds in milliseconds
  },
];

function AutoGenerators({
  vibe,
  setVibe,
  clickPower,
  setVibePerSecond,
  aiAgent,
  setAiAgent,
  vibeProducers,
  setVibeProducers
}: AutoGeneratorsProps) {
  const [activeGenerators, setActiveGenerators] = useState<Generator[]>([]);

  // Handle purchase of AI Agent component
  const handlePurchaseComponent = (componentType: 'processingUnit' | 'powerCore'): void => {
    const component = AI_AGENT.components[componentType];
    const cost = calculateCost(component.baseCost, aiAgent.components[componentType].count);

    if (vibe.isGreaterThanOrEqualTo(cost)) {
      // Update vibe count
      setVibe(vibe.minus(cost));

      // Update component count
      setAiAgent({
        ...aiAgent,
        components: {
          ...aiAgent.components,
          [componentType]: {
            ...aiAgent.components[componentType],
            count: aiAgent.components[componentType].count.plus(1),
            level: 1
          }
        }
      });

      // Add to active generators if it's the processing unit
      if (componentType === 'processingUnit') {
        const newGenerator: Generator = {
          id: `${component.id}_${Date.now()}`,
          name: component.name,
          description: component.description,
          baseValue: clickPower.times(aiAgent.components.powerCore.level > 0 ?
            AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level - 1].value : 1),
          interval: 1000 / component.levels[0].value,
          level: 1
        };
        setActiveGenerators(prev => [...prev, newGenerator]);
      }
    }
  };

  // Handle upgrade of AI Agent component
  const handleUpgradeComponent = (componentType: 'processingUnit' | 'powerCore'): void => {
    const component = AI_AGENT.components[componentType];
    const currentLevel = aiAgent.components[componentType].level;
    if (currentLevel >= component.levels.length) return;

    const upgradeCost = component.levels[currentLevel - 1].upgradeCost;

    if (vibe.isGreaterThanOrEqualTo(upgradeCost)) {
      // Update vibe count
      setVibe(vibe.minus(upgradeCost));

      // Update component level
      setAiAgent({
        ...aiAgent,
        components: {
          ...aiAgent.components,
          [componentType]: {
            ...aiAgent.components[componentType],
            level: currentLevel + 1
          }
        }
      });

      // Update active generators if it's the processing unit
      if (componentType === 'processingUnit') {
        setActiveGenerators(prev =>
          prev.map(generator => {
            if (generator.id.startsWith(component.id)) {
              return {
                ...generator,
                level: currentLevel + 1,
                interval: 1000 / component.levels[currentLevel].value
              };
            }
            return generator;
          })
        );
      }
    }
  };

  // Handle purchase of Vibe Producer
  const handlePurchaseProducer = (producerIndex: number): void => {
    const producer = VIBE_PRODUCERS[producerIndex];
    const cost = calculateCost(producer.baseCost, vibeProducers[producerIndex].count);

    if (vibe.isGreaterThanOrEqualTo(cost)) {
      // Update vibe count
      setVibe(vibe.minus(cost));

      // Update producer count
      setVibeProducers((prev: VibeProducer[]) =>
        prev.map((p: VibeProducer, index: number) =>
          index === producerIndex ? { ...p, count: p.count.plus(1) } : p
        )
      );

      // Add to active generators
      const newGenerator: Generator = {
        id: `${producer.id}_${Date.now()}`,
        name: producer.name,
        description: producer.description,
        baseValue: producer.baseValue,
        interval: producer.interval,
        level: 1
      };
      setActiveGenerators(prev => [...prev, newGenerator]);
    }
  };

  // Calculate Vibe per Second
  useEffect(() => {
    let totalVibePerSecond = new BigNumber(0);

    // Calculate AI Agent contribution
    activeGenerators.forEach(generator => {
      if (generator.id.startsWith('processing_unit')) {
        // Get the power core multiplier
        const powerCoreMultiplier = aiAgent.components.powerCore.level > 0 ?
          AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level - 1].value : 1;

        // Calculate clicks per second based on processing unit level
        const clicksPerSecond = AI_AGENT.components.processingUnit.levels[generator.level - 1].value;
        totalVibePerSecond = totalVibePerSecond.plus(clickPower.times(powerCoreMultiplier).times(clicksPerSecond));
      } else {
        // Producers generate their own value
        const timesPerSecond = new BigNumber(1000).dividedBy(generator.interval);
        totalVibePerSecond = totalVibePerSecond.plus(generator.baseValue.times(timesPerSecond));
      }
    });

    setVibePerSecond(totalVibePerSecond);
  }, [activeGenerators, clickPower, setVibePerSecond, aiAgent.components.powerCore.level]);

  // Effect to handle auto-generation
  useEffect(() => {
    if (activeGenerators.length === 0) return;

    const intervals = activeGenerators.map(generator => {
      return setInterval(() => {
        if (generator.id.startsWith('ai_agent')) {
          // AI Agents use the current click power
          setVibe((prevVibe: BigNumber) => prevVibe.plus(clickPower));
        } else {
          // Producers generate their own value
          setVibe((prevVibe: BigNumber) => prevVibe.plus(generator.baseValue));
        }
      }, generator.interval);
    });

    // Cleanup intervals on unmount or when activeGenerators change
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [activeGenerators, clickPower, setVibe]);


  const isAIAgentEnabled = (aiAgent.components.processingUnit.count.isGreaterThan(0) || vibe.isGreaterThanOrEqualTo(AI_AGENT.components.processingUnit.baseCost))


  return (
    <>
      {/* AI Agent Section - Show if you have one or can afford one */}

      <div className={`mt-12 w-full bg-gray-800 bg-opacity-50 p-6 rounded-lg relative overflow-hidden ${isAIAgentEnabled ? 'opacity-100' : 'opacity-50'}`}>
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-bold text-center mb-2">AI Agent</h2>
            <p className="text-sm text-gray-300 text-center max-w-2xl">
              A sophisticated system composed of advanced components that work together to maximize Vibe production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Processing Unit */}
            <div className="p-6 bg-gray-700 rounded-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col items-center mb-4">
                  <h3 className="text-2xl font-bold text-center mb-2">{AI_AGENT.components.processingUnit.name}</h3>
                  <p className="text-sm text-gray-300 text-center">{AI_AGENT.components.processingUnit.description}</p>
                </div>

                {aiAgent.components.processingUnit.count.isEqualTo(0) ? (
                  <button
                    onClick={() => handlePurchaseComponent('processingUnit')}
                    disabled={!vibe.isGreaterThanOrEqualTo(AI_AGENT.components.processingUnit.baseCost)}
                    className={`btn ${vibe.isGreaterThanOrEqualTo(AI_AGENT.components.processingUnit.baseCost) ? 'btn-primary' : 'btn-disabled'} w-full mb-4`}
                  >
                    Buy ({formatVibeWithSi(AI_AGENT.components.processingUnit.baseCost)})
                  </button>
                ) : (
                  <>
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                      <p className="text-lg font-semibold text-center mb-2">
                        {AI_AGENT.components.processingUnit.levels[aiAgent.components.processingUnit.level - 1].name}
                      </p>
                      <p className="text-sm text-gray-300 text-center">
                        {AI_AGENT.components.processingUnit.levels[aiAgent.components.processingUnit.level - 1].description}
                      </p>
                    </div>
                    {aiAgent.components.processingUnit.level < AI_AGENT.components.processingUnit.levels.length && (
                      <button
                        onClick={() => handleUpgradeComponent('processingUnit')}
                        disabled={!vibe.isGreaterThanOrEqualTo(AI_AGENT.components.processingUnit.levels[aiAgent.components.processingUnit.level - 1].upgradeCost)}
                        className={`btn ${vibe.isGreaterThanOrEqualTo(AI_AGENT.components.processingUnit.levels[aiAgent.components.processingUnit.level - 1].upgradeCost) ? 'btn-primary' : 'btn-disabled'} w-full`}
                      >
                        Upgrade to {AI_AGENT.components.processingUnit.levels[aiAgent.components.processingUnit.level].name} ({formatVibeWithSi(AI_AGENT.components.processingUnit.levels[aiAgent.components.processingUnit.level - 1].upgradeCost)})
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Power Core */}
            <div className="p-6 bg-gray-700 rounded-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col items-center mb-4">
                  <h3 className="text-2xl font-bold text-center mb-2">{AI_AGENT.components.powerCore.name}</h3>
                  <p className="text-sm text-gray-300 text-center">{AI_AGENT.components.powerCore.description}</p>
                </div>

                {aiAgent.components.powerCore.count.isEqualTo(0) ? (
                  <button
                    onClick={() => handlePurchaseComponent('powerCore')}
                    disabled={!vibe.isGreaterThanOrEqualTo(AI_AGENT.components.powerCore.baseCost)}
                    className={`btn ${vibe.isGreaterThanOrEqualTo(AI_AGENT.components.powerCore.baseCost) ? 'btn-primary' : 'btn-disabled'} w-full mb-4`}
                  >
                    Buy ({formatVibeWithSi(AI_AGENT.components.powerCore.baseCost)})
                  </button>
                ) : (
                  <>
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                      <p className="text-lg font-semibold text-center mb-2">
                        {AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level - 1].name}
                      </p>
                      <p className="text-sm text-gray-300 text-center">
                        {AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level - 1].description}
                      </p>
                    </div>
                    {aiAgent.components.powerCore.level < AI_AGENT.components.powerCore.levels.length && (
                      <button
                        onClick={() => handleUpgradeComponent('powerCore')}
                        disabled={!vibe.isGreaterThanOrEqualTo(AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level - 1].upgradeCost)}
                        className={`btn ${vibe.isGreaterThanOrEqualTo(AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level - 1].upgradeCost) ? 'btn-primary' : 'btn-disabled'} w-full`}
                      >
                        Upgrade to {AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level].name} ({formatVibeWithSi(AI_AGENT.components.powerCore.levels[aiAgent.components.powerCore.level - 1].upgradeCost)})
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vibe Producers Section - Only show after buying an AI Agent */}
      {aiAgent.components.processingUnit.count.isGreaterThan(0) && (
        <div className="mt-12 w-full bg-gray-800 bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Vibe Producers</h2>
          <p className="text-sm mb-4 text-gray-300">Vibe Producers generate Vibe automatically over time</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIBE_PRODUCERS.map((producer, index) => {
              const cost = calculateCost(producer.baseCost, vibeProducers[index].count);
              const canAfford = vibe.isGreaterThanOrEqualTo(cost);

              return (
                <div
                  key={producer.id}
                  className={`p-4 rounded-lg ${canAfford ? "bg-gray-700" : "bg-gray-900"
                    } transition-all duration-300`}
                >
                  <h4 className="text-xl font-bold">{producer.name}</h4>
                  <p className="text-sm mb-2">{producer.description}</p>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handlePurchaseProducer(index)}
                      disabled={!canAfford}
                      className={`btn btn-sm ${canAfford ? "btn-primary" : "btn-disabled"
                        } mb-2`}
                    >
                      Buy ({formatVibeWithSi(cost)})
                    </button>
                    <div>
                      <p className="text-sm">Owned: {formatWithSi(vibeProducers[index].count)}</p>
                      <p className="text-sm">Production: +{formatWithSi(producer.baseValue)} Vibe/10s</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default AutoGenerators; 