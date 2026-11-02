export type SnackBounds = {
  width: number;
  height: number;
  basketTop: number;
  basketWidth: number;
  basketHeight: number;
};

export function clampBasketPosition(position: number, bounds: SnackBounds) {
  const edge = Math.min(50, (bounds.basketWidth / bounds.width) * 50);
  return Math.max(edge, Math.min(100 - edge, position));
}

export function catchesSnack(
  drop: { x: number; y: number; width: number; height: number },
  previousY: number,
  basketX: number,
  bounds: SnackBounds,
) {
  const distanceX = (Math.abs(drop.x - basketX) / 100) * bounds.width;
  const bottom = (drop.y / 100) * bounds.height + drop.height / 2;
  const previousTop = (previousY / 100) * bounds.height - drop.height / 2;
  return (
    distanceX <= (bounds.basketWidth + drop.width) / 2 &&
    bottom >= bounds.basketTop &&
    previousTop <= bounds.basketTop + bounds.basketHeight * 0.6
  );
}
