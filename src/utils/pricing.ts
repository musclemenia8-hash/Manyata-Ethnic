import { CartItem, Product } from '../types';

export interface BundleTier {
  count: number;
  price: number;
  label: string;
}

// Official Manyata Ethnic Special Bundle Offer prices (strictly 1, 2, 3, and 5 dresses)
export const OFFICIAL_BUNDLE_TIERS: BundleTier[] = [
  { count: 1, price: 699, label: '1 Dress' },
  { count: 2, price: 1299, label: '2 Dresses' },
  { count: 3, price: 1699, label: '3 Dresses' },
  { count: 5, price: 2499, label: '5 Dresses' },
];

export interface CartPricingSummary {
  totalUnits: number;
  regularTotal: number;
  finalTotal: number;
  savings: number;
  appliedBreakdown: Array<{ label: string; amount: number }>;
  nextTierHint: string | null;
}

export function calculateUnitsOfferTotal(totalUnits: number): {
  bundleTotal: number;
  breakdown: Array<{ label: string; amount: number }>;
} {
  let remaining = totalUnits;
  let bundleTotal = 0;
  const breakdown: Array<{ label: string; amount: number }> = [];

  while (remaining >= 5) {
    bundleTotal += 2499;
    breakdown.push({ label: '5 Dresses Offer', amount: 2499 });
    remaining -= 5;
  }
  while (remaining >= 3) {
    bundleTotal += 1699;
    breakdown.push({ label: '3 Dresses Offer', amount: 1699 });
    remaining -= 3;
  }
  while (remaining >= 2) {
    bundleTotal += 1299;
    breakdown.push({ label: '2 Dresses Offer', amount: 1299 });
    remaining -= 2;
  }
  while (remaining >= 1) {
    bundleTotal += 699;
    breakdown.push({ label: '1 Dress Offer', amount: 699 });
    remaining -= 1;
  }

  return { bundleTotal, breakdown };
}

export function calculateBundlePricing(
  items: CartItem[],
  productsMap: Map<string, Product>
): CartPricingSummary {
  let totalUnits = 0;
  let regularTotal = 0;

  for (const item of items) {
    const product = productsMap.get(item.productId);
    if (!product || item.quantity <= 0) continue;
    totalUnits += item.quantity;
    regularTotal += product.price * item.quantity;
  }

  if (totalUnits === 0) {
    return {
      totalUnits: 0,
      regularTotal: 0,
      finalTotal: 0,
      savings: 0,
      appliedBreakdown: [],
      nextTierHint: '1 Dress ₹699 · 2 Dresses ₹1,299 · 3 Dresses ₹1,699 · 5 Dresses ₹2,499.',
    };
  }

  const { bundleTotal, breakdown } = calculateUnitsOfferTotal(totalUnits);
  const finalTotal = Math.min(bundleTotal, regularTotal);
  const savings = Math.max(0, regularTotal - finalTotal);

  let nextTierHint: string | null = null;
  if (totalUnits === 1) {
    nextTierHint = 'Add 1 more dress for the 2 Dresses Offer (₹1,299).';
  } else if (totalUnits === 2) {
    nextTierHint = 'Add 1 more dress for the 3 Dresses Offer (₹1,699).';
  } else if (totalUnits === 3 || totalUnits === 4) {
    const needed = 5 - totalUnits;
    nextTierHint = `Add ${needed} more dress${needed > 1 ? 'es' : ''} for the 5 Dresses Offer (₹2,499).`;
  }

  return {
    totalUnits,
    regularTotal,
    finalTotal,
    savings,
    appliedBreakdown: breakdown,
    nextTierHint,
  };
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
