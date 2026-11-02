export function shuffledPairs(random: () => number = Math.random) {
  const cards = Array.from({ length: 12 }, (_, id) => ({ id, pair: id % 6 }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
