import { describe, it, expect } from "vitest";
import { shuffledPairs } from "../src/lib/arcade/memory";
import { findGame, games } from "../src/lib/arcade/catalog";
describe("lounge game definitions", () => {
  it("keeps unique routable game ids and rejects unknown games", () => {
    expect(new Set(games.map((g) => g.id)).size).toBe(4);
    expect(findGame("memory")?.duration).toBe(40);
    expect(findGame("missing")).toBeUndefined();
  });
  it("deals six complete pairs with unique card identities", () => {
    for (let i = 0; i < 20; i++) {
      const deck = shuffledPairs();
      expect(deck).toHaveLength(12);
      expect(new Set(deck.map((c) => c.id)).size).toBe(12);
      for (let pair = 0; pair < 6; pair++)
        expect(deck.filter((c) => c.pair === pair)).toHaveLength(2);
    }
  });
  it("can reproduce a deal from a supplied random source", () => {
    expect(shuffledPairs(() => 0.5)).toEqual(shuffledPairs(() => 0.5));
    expect(shuffledPairs(() => 0)).not.toEqual(shuffledPairs(() => 0.99));
  });
});
