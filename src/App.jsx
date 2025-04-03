import { useState, useEffect, useMemo } from "react";
import "./App.css";
import PowerupShop from "./components/PowerupShop";
import Achievements from "./components/Achievements";
import AutoGenerators, { AI_AGENT } from "./components/AutoGenerators";
import NewsReel from "./components/NewsReel";
import { formatWithSi, formatVibeWithSi } from "./utils/formatNumber";
import BigNumber from "bignumber.js";

// Credits component
const Credits = () => {
  return (
    <div className="absolute top-4 left-4 text-sm text-gray-400 z-10 flex flex-row gap-2 items-center">
      <p>
        Vibe coded by{" "}
        <a
          href="https://github.com/maxwfreu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:text-indigo-400"
        >
          Max Freundlich
        </a>
      </p>
      <div className="w-1 h-1 bg-indigo-800 rounded-full"></div>
      <p>
        Matrix background by{" "}
        <a
          href="https://codepen.io/wefiy/pen/WPpEwo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:text-indigo-400"
        >
          Boujjou Achraf
        </a>
      </p>
    </div>
  );
};

function App() {
  const [vibe, setVibe] = useState(new BigNumber(0));
  const [clickPower, setClickPower] = useState(new BigNumber(1));
  const [powerups, setPowerups] = useState([
    {
      id: "coffee",
      name: "Coffee",
      description: "Increases click power by 1",
      cost: new BigNumber(10),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(1),
      tier: 1,
    },
    {
      id: "energy_drink",
      name: "Energy Drink",
      description: "Increases click power by 2",
      cost: new BigNumber(25),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(2),
      tier: 1,
    },
    {
      id: "coding_bootcamp",
      name: "Coding Bootcamp",
      description: "Increases click power by 5",
      cost: new BigNumber(100),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(5),
      tier: 1,
    },
    {
      id: "new_laptop",
      name: "New Laptop",
      description: "Increases click power by 10",
      cost: new BigNumber(500),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(10),
      tier: 2,
    },
    {
      id: "standing_desk",
      name: "Standing Desk",
      description: "Increases click power by 20",
      cost: new BigNumber(1000),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(20),
      tier: 2,
    },
    {
      id: "ergonomic_chair",
      name: "Ergonomic Chair",
      description: "Increases click power by 50",
      cost: new BigNumber(2500),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(50),
      tier: 2,
    },
    {
      id: "home_office",
      name: "Home Office",
      description: "Increases click power by 100",
      cost: new BigNumber(10000),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(100),
      tier: 3,
    },
    {
      id: "coding_workshop",
      name: "Coding Workshop",
      description: "Increases click power by 200",
      cost: new BigNumber(25000),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(200),
      tier: 3,
    },
    {
      id: "tech_startup",
      name: "Tech Startup",
      description: "Increases click power by 500",
      cost: new BigNumber(100000),
      count: new BigNumber(0),
      powerIncrease: new BigNumber(500),
      tier: 3,
    },
  ]);
  const [vibePerSecond, setVibePerSecond] = useState(new BigNumber(0));
  const [aiAgent, setAiAgent] = useState({
    id: "ai_agent",
    name: "AI Agent",
    description: "Automatically clicks the Vibe button for you",
    components: {
      processingUnit: {
        id: "processing_unit",
        name: "Processing Unit",
        description: "Increases clicks per second",
        count: new BigNumber(0),
        level: 1,
      },
      powerCore: {
        id: "power_core",
        name: "Power Core",
        description: "Multiplies click power",
        count: new BigNumber(0),
        level: 1,
      },
    },
  });
  const [vibeProducers, setVibeProducers] = useState([
    { id: "intern", count: new BigNumber(0) },
    { id: "junior_dev", count: new BigNumber(0) },
    { id: "senior_dev", count: new BigNumber(0) },
    { id: "tech_lead", count: new BigNumber(0) },
  ]);

  const handleClick = () => {
    setVibe((prevVibe) => prevVibe.plus(clickPower));
  };

  const handlePurchasePowerup = (powerupId, quantity = 1) => {
    const powerup = powerups.find((p) => p.id === powerupId);
    if (!powerup) return;

    // Calculate total cost for the quantity
    let totalCost = new BigNumber(0);
    let totalPowerIncrease = new BigNumber(0);
    const bnQuantity = new BigNumber(quantity);

    for (let i = 0; i < bnQuantity.toNumber(); i++) {
      const currentCost = powerup.cost.times(
        new BigNumber(1.15).pow(powerup.count.plus(i))
      );
      totalCost = totalCost.plus(currentCost);
      totalPowerIncrease = totalPowerIncrease.plus(powerup.powerIncrease);
    }

    if (vibe.isGreaterThanOrEqualTo(totalCost)) {
      setVibe((prevVibe) => prevVibe.minus(totalCost));
      setClickPower((prevPower) => prevPower.plus(totalPowerIncrease));
      setPowerups((prevPowerups) =>
        prevPowerups.map((p) =>
          p.id === powerupId ? { ...p, count: p.count.plus(quantity) } : p
        )
      );
    }
  };

  // Calculate total VPS from all generators
  const calculateTotalVPS = () => {
    let totalVPS = new BigNumber(0);

    // Add AI Agent contribution
    if (aiAgent.components.processingUnit.count.isGreaterThan(0)) {
      // Get the power core multiplier
      const powerCoreMultiplier =
        aiAgent.components.powerCore.level > 0
          ? AI_AGENT.components.powerCore.levels[
              aiAgent.components.powerCore.level - 1
            ].value
          : 1;

      // Calculate clicks per second based on processing unit level
      const clicksPerSecond =
        AI_AGENT.components.processingUnit.levels[
          aiAgent.components.processingUnit.level - 1
        ].value;
      totalVPS = totalVPS.plus(
        clickPower.times(powerCoreMultiplier).times(clicksPerSecond)
      );
    }

    // Add Vibe Producers contribution
    vibeProducers.forEach((producer, index) => {
      if (producer.count.isGreaterThan(0)) {
        const baseValue = new BigNumber([2, 5, 15, 50][index]);
        const timesPerSecond = new BigNumber(1000).dividedBy(10000); // 10 seconds interval
        totalVPS = totalVPS.plus(
          baseValue.times(producer.count).times(timesPerSecond)
        );
      }
    });

    return totalVPS;
  };

  // Update VPS and handle real-time generation
  useEffect(() => {
    const updateInterval = 100; // Update every 100ms
    const interval = setInterval(() => {
      const currentVPS = calculateTotalVPS();
      setVibePerSecond(currentVPS);

      // Increment vibe based on VPS and time elapsed
      const increment = currentVPS.dividedBy(1000).times(updateInterval);
      if (increment.isGreaterThan(0)) {
        setVibe((prevVibe) => prevVibe.plus(increment));
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [aiAgent, vibeProducers, clickPower]);

  const memoizedVibePerSecond = useMemo(() => vibePerSecond, [vibePerSecond]);

  // Calculate background opacity based on vibe per second
  const getBackgroundOpacity = (vps) => {
    // Start at 100% opacity (bg-gray-900)
    // Gradually decrease to 0% opacity as VPS increases
    // Using a logarithmic scale to make the transition smoother
    const maxVPS = 1000000; // Maximum VPS for full transparency
    const minOpacity = 0.1; // Minimum opacity (10%)
    const opacity = Math.max(
      minOpacity,
      1 - Math.log10(vps + 1) / Math.log10(maxVPS + 1)
    );
    return opacity;
  };

  const backgroundOpacity = getBackgroundOpacity(
    memoizedVibePerSecond.toNumber()
  );

  return (
    <div className="min-h-screen text-white relative">
      <canvas
        className="absolute top-0 left-0 w-full h-full -z-50"
        id="c"
      ></canvas>
      <div
        className="absolute top-0 left-0 w-full h-full -z-40"
        style={{
          backgroundColor: `rgba(17, 24, 39, ${backgroundOpacity})`, // bg-gray-900 with dynamic opacity
        }}
      />
      <Credits />
      <div className="container mx-auto px-4 py-8 relative ">
        <NewsReel vibePerSecond={memoizedVibePerSecond} />

        <div className="grid lg:grid-cols-8 gap-8 p-4 max-w-7xl w-full mx-auto">
          <div className="lg:col-span-3 p-4">
            <h1 className="text-5xl font-bold mb-8 text-center">Vibe Coder</h1>

            <div className="text-3xl mb-8">
              Vibe:{" "}
              <span className="font-bold text-yellow-300">
                {formatVibeWithSi(vibe)}
              </span>
            </div>

            <button
              onClick={handleClick}
              className="btn btn-primary btn-lg rounded-full w-48 h-48 text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 vibe-button"
            >
              VIBE
            </button>

            <div className="mt-8 text-xl flex flex-col items-center">
              <div>
                Click Power:{" "}
                <span className="font-bold text-green-400">
                  {formatWithSi(clickPower)}
                </span>
              </div>
              <div className="mt-1">
                Vibe per Second:{" "}
                <span className="font-bold text-blue-400">
                  {formatWithSi(memoizedVibePerSecond)}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Achievements
                powerups={powerups}
                aiAgent={aiAgent}
                vibeProducers={vibeProducers}
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <PowerupShop
              powerups={powerups}
              vibe={vibe}
              onPurchase={handlePurchasePowerup}
              setVibe={setVibe}
            />

            <AutoGenerators
              vibe={vibe}
              setVibe={setVibe}
              clickPower={clickPower}
              setVibePerSecond={setVibePerSecond}
              aiAgent={aiAgent}
              setAiAgent={setAiAgent}
              vibeProducers={vibeProducers}
              setVibeProducers={setVibeProducers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
