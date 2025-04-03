import BigNumber from 'bignumber.js';

// Convert a number or string to BigNumber
const toBigNumber = (value: number | string | BigNumber): BigNumber => {
  if (value instanceof BigNumber) return value;
  return new BigNumber(value);
};

// Format a number with commas
const formatWithCommas = (bn: BigNumber): string => {
  return bn.toFormat(0);
};

// Format vibe with commas
const formatVibe = (bn: BigNumber): string => {
  return `${bn.toFormat(0)} Vibe`;
};

// Format a number with SI prefixes (K, M, B, T, etc.)
export const formatWithSi = (number: number | string | BigNumber): string => {
  const bn = toBigNumber(number);
  if (bn.isLessThan(1000)) return formatWithCommas(bn);

  // Custom SI prefixes for very large numbers
  const prefixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg', 'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg'];

  let exponent = 0;
  let reduced = bn;
  while (reduced.isGreaterThanOrEqualTo(1000) && exponent < prefixes.length - 1) {
    reduced = reduced.dividedBy(1000);
    exponent++;
  }

  return `${reduced.toFormat(2)}${prefixes[exponent]}`;
};

// Format vibe with SI prefixes
export const formatVibeWithSi = (number: number | string | BigNumber): string => {
  const bn = toBigNumber(number);
  if (bn.isLessThan(1000)) return formatVibe(bn);
  return `${formatWithSi(bn)} Vibe`;
};

// Format a number with custom precision
export const formatWithPrecision = (number: number | string | BigNumber, precision = 2): string => {
  const bn = toBigNumber(number);
  if (bn.isLessThan(1000)) return formatWithCommas(bn);
  return bn.toFormat(precision);
};

// Format vibe with custom precision
export const formatVibeWithPrecision = (number: number | string | BigNumber, precision = 2): string => {
  const bn = toBigNumber(number);
  if (bn.isLessThan(1000)) return formatVibe(bn);
  return `${bn.toFormat(precision)} Vibe`;
};

// Helper function to calculate costs with BigNumber
export const calculateCost = (baseCost: number | string | BigNumber, count: number | string | BigNumber, quantity: number | string | BigNumber = 1): BigNumber => {
  const bnBaseCost = toBigNumber(baseCost);
  const bnCount = toBigNumber(count);
  const bnQuantity = toBigNumber(quantity);

  let totalCost = new BigNumber(0);
  for (let i = 0; i < bnQuantity.toNumber(); i++) {
    // Calculate the cost for this item and round to nearest integer
    const currentCost = bnBaseCost.times(new BigNumber(1.15).pow(bnCount.plus(i))).integerValue(BigNumber.ROUND_UP);
    totalCost = totalCost.plus(currentCost);
  }

  return totalCost;
};

// Helper function to calculate max quantity with BigNumber
export const calculateMaxQuantity = (baseCost: number | string | BigNumber, count: number | string | BigNumber, currentVibe: number | string | BigNumber): number => {
  const bnBaseCost = toBigNumber(baseCost);
  const bnCount = toBigNumber(count);
  const bnCurrentVibe = toBigNumber(currentVibe);

  let maxQuantity = new BigNumber(0);
  let totalCost = new BigNumber(0);

  while (true) {
    // Calculate the cost for this item and round to nearest integer
    const nextCost = bnBaseCost.times(new BigNumber(1.15).pow(bnCount.plus(maxQuantity))).integerValue(BigNumber.ROUND_UP);
    if (totalCost.plus(nextCost).isGreaterThan(bnCurrentVibe)) break;
    totalCost = totalCost.plus(nextCost);
    maxQuantity = maxQuantity.plus(1);
  }

  return maxQuantity.toNumber();
}; 