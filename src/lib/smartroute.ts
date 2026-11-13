export type PayoutMethod = "Bank transfer" | "Mobile money" | "Digital wallet";
export type RoutingPreference = "balanced" | "cheapest" | "fastest" | "reliable";

export type ProviderQuote = {
  provider: string;
  feeRate: number;
  fixedFee: number;
  exchangeRate: number;
  settlementMinutes: number;
  reliability: number;
  methods: PayoutMethod[];
  available: boolean;
  note: string;
};

export type ScoredRoute = ProviderQuote & {
  transferFee: number;
  payoutAmount: number;
  totalSenderCost: number;
  score: number;
  reason: string;
};

export const DEMO_QUOTES: ProviderQuote[] = [
  {
    provider: "Savanna Transfer",
    feeRate: 0.012,
    fixedFee: 18,
    exchangeRate: 0.0532,
    settlementMinutes: 35,
    reliability: 96,
    methods: ["Bank transfer", "Mobile money"],
    available: true,
    note: "Strong value with a dependable payout network",
  },
  {
    provider: "Kopano Pay",
    feeRate: 0.008,
    fixedFee: 32,
    exchangeRate: 0.0524,
    settlementMinutes: 180,
    reliability: 92,
    methods: ["Bank transfer", "Digital wallet"],
    available: true,
    note: "Lower percentage fee, longer settlement window",
  },
  {
    provider: "Swift Kraal",
    feeRate: 0.019,
    fixedFee: 10,
    exchangeRate: 0.0536,
    settlementMinutes: 12,
    reliability: 89,
    methods: ["Mobile money", "Digital wallet"],
    available: true,
    note: "Fastest estimated payout in this demo corridor",
  },
  {
    provider: "Riverstone Network",
    feeRate: 0.011,
    fixedFee: 14,
    exchangeRate: 0.0531,
    settlementMinutes: 55,
    reliability: 94,
    methods: ["Bank transfer", "Mobile money", "Digital wallet"],
    available: false,
    note: "Temporarily unavailable for this demonstration",
  },
];

export const ROUTE_WEIGHTS: Record<RoutingPreference, { cost: number; speed: number; reliability: number; availability: number }> = {
  balanced: { cost: 0.4, speed: 0.25, reliability: 0.2, availability: 0.15 },
  cheapest: { cost: 0.65, speed: 0.15, reliability: 0.12, availability: 0.08 },
  fastest: { cost: 0.15, speed: 0.6, reliability: 0.12, availability: 0.13 },
  reliable: { cost: 0.15, speed: 0.15, reliability: 0.58, availability: 0.12 },
};

export function compareRoutes(
  amount: number,
  payoutMethod: PayoutMethod,
  preference: RoutingPreference = "balanced",
  quotes: ProviderQuote[] = DEMO_QUOTES,
): ScoredRoute[] {
  if (!Number.isFinite(amount) || amount <= 0) return [];
  const eligible = quotes.filter((quote) => quote.available && quote.methods.includes(payoutMethod));
  if (!eligible.length) return [];

  const candidates = eligible.map((quote) => {
    const transferFee = Math.round((amount * quote.feeRate + quote.fixedFee) * 100) / 100;
    const payoutAmount = Math.round(Math.max(0, amount - transferFee) * quote.exchangeRate * 100) / 100;
    return { ...quote, transferFee, payoutAmount, totalSenderCost: amount + transferFee };
  });
  const minCost = Math.min(...candidates.map((item) => item.transferFee));
  const maxCost = Math.max(...candidates.map((item) => item.transferFee));
  const minTime = Math.min(...candidates.map((item) => item.settlementMinutes));
  const maxTime = Math.max(...candidates.map((item) => item.settlementMinutes));
  const weights = ROUTE_WEIGHTS[preference];

  return candidates
    .map((item) => {
      const costScore = maxCost === minCost ? 100 : 100 * (maxCost - item.transferFee) / (maxCost - minCost);
      const speedScore = maxTime === minTime ? 100 : 100 * (maxTime - item.settlementMinutes) / (maxTime - minTime);
      const score = Math.round(
        costScore * weights.cost +
        speedScore * weights.speed +
        item.reliability * weights.reliability +
        100 * weights.availability,
      );
      return { ...item, score: Math.max(0, Math.min(100, score)), reason: item.note };
    })
    .sort((a, b) => b.score - a.score);
}

export type PurposeAllocation = { label: string; amount: number };

export function allocationsMatchTotal(allocations: PurposeAllocation[], total: number): boolean {
  if (!Number.isFinite(total) || total <= 0 || allocations.length === 0) return false;
  if (allocations.some((allocation) => !allocation.label.trim() || !Number.isFinite(allocation.amount) || allocation.amount < 0)) return false;
  const sumCents = allocations.reduce((sum, allocation) => sum + Math.round(allocation.amount * 100), 0);
  return sumCents === Math.round(total * 100);
}