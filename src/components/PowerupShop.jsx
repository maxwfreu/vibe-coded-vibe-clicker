// PowerupShop component
import React, { useState, useMemo, useCallback } from "react";
import BigNumber from "bignumber.js";
import {
  formatVibeWithSi,
  formatWithSi,
  calculateCost,
  calculateMaxQuantity,
} from "../utils/formatNumber";

// Move PowerupCard outside to prevent recreation on every render
const PowerupCard = React.memo(
  ({ powerup, isEnabled, vibe, selectedQuantity, onPurchase }) => {
    const maxQuantity = useMemo(
      () => calculateMaxQuantity(powerup.cost, powerup.count, vibe),
      [powerup.cost, powerup.count, vibe]
    );

    const quantity = useMemo(
      () =>
        selectedQuantity === "MAX"
          ? new BigNumber(maxQuantity)
          : selectedQuantity,
      [selectedQuantity, maxQuantity]
    );

    const cost = useMemo(
      () => calculateCost(powerup.cost, powerup.count, quantity),
      [powerup.cost, powerup.count, quantity]
    );

    const isGreater = useMemo(
      () => vibe.isGreaterThanOrEqualTo(cost),
      [vibe, cost]
    );

    const canAfford =
      isGreater && isEnabled && (selectedQuantity !== "MAX" || maxQuantity > 0);

    return (
      <div
        className={`p-4 rounded-lg ${
          canAfford ? "bg-gray-700" : "bg-gray-900"
        } transition-all duration-300`}
      >
        <h4 className="text-xl font-bold">{powerup.name}</h4>
        <p className="text-sm mb-2">{powerup.description}</p>
        <div className="flex flex-col">
          <button
            onClick={() => onPurchase(powerup.id, quantity)}
            disabled={!canAfford}
            className={`btn ${canAfford ? "btn-primary" : "btn-disabled"} mb-2`}
          >
            Buy {formatWithSi(quantity)} ({formatVibeWithSi(cost)})
          </button>
          <div>
            <p className="text-sm">Owned: {formatWithSi(powerup.count)}</p>
            <p className="text-sm">
              Boost: +{formatWithSi(powerup.powerIncrease)}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

function PowerupShop({ powerups, vibe, onPurchase, setVibe }) {
  // Add state for quantity selection
  const [selectedQuantity, setSelectedQuantity] = useState(new BigNumber(1));
  const [selectedTier, setSelectedTier] = useState(1);

  // Memoize tier checks
  const t2Enabled = useMemo(() => {
    const t1Powerups = powerups.filter((p) => p.tier === 1);
    return t1Powerups.every((p) => p.count.isGreaterThanOrEqualTo(10));
  }, [powerups]);

  const t3Enabled = useMemo(() => {
    const t2Powerups = powerups.filter((p) => p.tier === 2);
    return t2Powerups.every((p) => p.count.isGreaterThanOrEqualTo(10));
  }, [powerups]);

  // Memoize filtered powerups
  const t1Powerups = useMemo(
    () => powerups.filter((p) => p.tier === 1),
    [powerups]
  );
  const t2Powerups = useMemo(
    () => powerups.filter((p) => p.tier === 2),
    [powerups]
  );
  const t3Powerups = useMemo(
    () => powerups.filter((p) => p.tier === 3),
    [powerups]
  );

  // Memoize event handlers
  const handleQuantityChange = useCallback((value) => {
    setSelectedQuantity(value === "MAX" ? value : new BigNumber(value));
  }, []);

  const handleTierChange = useCallback((tier) => {
    setSelectedTier(tier);
  }, []);

  const handleAddVibe = useCallback(
    (value) => {
      if (value) {
        setVibe(vibe.plus(new BigNumber(value)));
      }
    },
    [vibe, setVibe]
  );

  // Render powerups for a specific tier
  const renderTierPowerups = useCallback(
    (tierPowerups, isEnabled) => {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tierPowerups.map((powerup) => (
            <PowerupCard
              key={powerup.id}
              powerup={powerup}
              isEnabled={isEnabled}
              vibe={vibe}
              selectedQuantity={selectedQuantity}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      );
    },
    [vibe, selectedQuantity, onPurchase]
  );

  return (
    <div className="w-full bg-gray-800 bg-opacity-50 p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Powerup Shop</h2>
      <p className="text-sm mb-4 text-gray-300">
        Purchase powerups to increase your click power
      </p>

      {/* Debug Input - Only visible in development */}
      {/* eslint-disable-next-line no-undef */}
      {process.env.NODE_ENV === "development" && (
        <div className="flex justify-center gap-2 mb-6">
          <input
            type="number"
            placeholder="Enter Vibe amount"
            className="input input-bordered input-sm w-32"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddVibe(e.target.value);
                e.target.value = "";
              }
            }}
          />
          <button
            className="btn btn-sm btn-ghost"
            onClick={(e) => {
              const input = e.target.previousElementSibling;
              handleAddVibe(input.value);
              input.value = "";
            }}
          >
            Add Vibe
          </button>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => handleQuantityChange(1)}
          className={`btn btn-sm ${
            selectedQuantity === "MAX"
              ? "btn-neutral"
              : selectedQuantity.isEqualTo(1)
              ? "btn-primary bg-primary-focus text-primary-content"
              : "btn-neutral"
          }`}
        >
          1
        </button>
        <button
          onClick={() => handleQuantityChange(10)}
          className={`btn btn-sm ${
            selectedQuantity === "MAX"
              ? "btn-neutral"
              : selectedQuantity.isEqualTo(10)
              ? "btn-primary bg-primary-focus text-primary-content"
              : "btn-neutral"
          }`}
        >
          10
        </button>
        <button
          onClick={() => handleQuantityChange(100)}
          className={`btn btn-sm ${
            selectedQuantity === "MAX"
              ? "btn-neutral"
              : selectedQuantity.isEqualTo(100)
              ? "btn-primary bg-primary-focus text-primary-content"
              : "btn-neutral"
          }`}
        >
          100
        </button>
        <button
          onClick={() => handleQuantityChange("MAX")}
          className={`btn btn-sm ${
            selectedQuantity === "MAX"
              ? "btn-primary bg-primary-focus text-primary-content"
              : "btn-neutral"
          }`}
        >
          MAX
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tabs tabs-border justify-center mb-6 gap-2">
        <button
          className={`tab h-auto ${selectedTier === 1 ? "tab-active" : ""}`}
          onClick={() => handleTierChange(1)}
          title="Tier 1 - Always available"
        >
          Tier 1
        </button>
        <button
          className={`tab h-auto ${selectedTier === 2 ? "tab-active" : ""} ${
            !t2Enabled ? "opacity-50" : ""
          }`}
          onClick={() => t2Enabled && handleTierChange(2)}
          disabled={!t2Enabled}
          title={
            !t2Enabled
              ? "Requires 10 of each Tier 1 powerup to unlock"
              : "Tier 2 - Unlocked"
          }
        >
          {!t2Enabled && "🔒 "}Tier 2
        </button>
        <button
          className={`tab h-auto ${selectedTier === 3 ? "tab-active" : ""} ${
            !t3Enabled ? "opacity-50" : ""
          }`}
          onClick={() => t3Enabled && handleTierChange(3)}
          disabled={!t3Enabled}
          title={
            !t3Enabled
              ? "Requires 10 of each Tier 2 powerup to unlock"
              : "Tier 3 - Unlocked"
          }
        >
          {!t3Enabled && "🔒 "}Tier 3
        </button>
      </div>

      {/* Powerup Grid */}
      {selectedTier === 1 && renderTierPowerups(t1Powerups, true)}
      {selectedTier === 2 && renderTierPowerups(t2Powerups, t2Enabled)}
      {selectedTier === 3 && renderTierPowerups(t3Powerups, t3Enabled)}
    </div>
  );
}

export default React.memo(PowerupShop);
