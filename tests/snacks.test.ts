import { describe, expect, it } from "vitest";
import {
  catchesSnack,
  clampBasketPosition,
  type SnackBounds,
} from "../src/components/arcade/games/snackPhysics";

const desktop: SnackBounds = {
  width: 1000,
  height: 500,
  basketTop: 400,
  basketWidth: 78,
  basketHeight: 64,
};
const mobile: SnackBounds = { ...desktop, width: 260 };
const drop = { x: 50, y: 80, width: 32, height: 32 };

describe("snack basket collision", () => {
  it("uses the visible basket width instead of a percentage of the screen", () => {
    expect(catchesSnack(drop, 79, 50, desktop)).toBe(true);
    expect(catchesSnack(drop, 79, 60, desktop)).toBe(false);
    expect(catchesSnack(drop, 79, 60, mobile)).toBe(true);
  });

  it("does not catch snacks above or below the basket", () => {
    expect(catchesSnack({ ...drop, y: 70 }, 69, 50, desktop)).toBe(false);
    expect(catchesSnack({ ...drop, y: 95 }, 94, 50, desktop)).toBe(false);
  });

  it("detects snacks that cross the basket between animation frames", () => {
    expect(catchesSnack({ ...drop, y: 90 }, 75, 50, desktop)).toBe(true);
  });

  it("keeps the entire basket visible at both screen edges", () => {
    for (const bounds of [desktop, mobile]) {
      const halfWidth = (bounds.basketWidth / bounds.width) * 50;
      expect(clampBasketPosition(-10, bounds)).toBeCloseTo(halfWidth);
      expect(clampBasketPosition(110, bounds)).toBeCloseTo(100 - halfWidth);
      expect(clampBasketPosition(50, bounds)).toBe(50);
    }
  });
});
