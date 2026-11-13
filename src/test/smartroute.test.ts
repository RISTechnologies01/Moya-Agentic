import { describe, expect, it } from "vitest";

import { allocationsMatchTotal, compareRoutes, DEMO_QUOTES, ROUTE_WEIGHTS } from "@/lib/smartroute";

describe("SmartRoute rules", () => {
  it("uses the requested balanced scoring weights", () => {
    expect(ROUTE_WEIGHTS.balanced).toEqual({ cost: 0.4, speed: 0.25, reliability: 0.2, availability: 0.15 });
  });

  it("excludes unavailable and payout-incompatible routes", () => {
    const routes = compareRoutes(2000, "Bank transfer");
    expect(routes.map((route) => route.provider)).toEqual(["Savanna Transfer", "Kopano Pay"]);
    expect(routes.every((route) => route.available && route.methods.includes("Bank transfer"))).toBe(true);
  });

  it("normalizes eligible recommendation scores between zero and 100", () => {
    const routes = compareRoutes(2000, "Mobile money");
    expect(routes.length).toBe(2);
    expect(routes.every((route) => route.score >= 0 && route.score <= 100)).toBe(true);
    expect(routes[0]?.score).toBeGreaterThanOrEqual(routes[1]?.score ?? 0);
  });

  it("returns no route when nothing can satisfy the chosen payout method", () => {
    const unavailable = DEMO_QUOTES.map((quote) => ({ ...quote, available: false }));
    expect(compareRoutes(2000, "Bank transfer", "balanced", unavailable)).toEqual([]);
  });
});

describe("PurposePay allocation rules", () => {
  it("accepts allocations that total the transfer exactly", () => {
    expect(allocationsMatchTotal([
      { label: "Groceries", amount: 800 },
      { label: "Electricity", amount: 400 },
      { label: "School fees", amount: 500 },
      { label: "Personal spending", amount: 300 },
    ], 2000)).toBe(true);
  });

  it("rejects allocations that do not total the transfer", () => {
    expect(allocationsMatchTotal([{ label: "Groceries", amount: 800 }], 2000)).toBe(false);
  });
});