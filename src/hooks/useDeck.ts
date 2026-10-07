import { useState } from 'react';

export function shuffle<Card>(cards: readonly Card[], random: () => number = Math.random): Card[] {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export interface DrawnCard<Card> {
  id: number;
  card: Card;
}

export function useDeck<Card>(cards: readonly Card[], random: () => number = Math.random) {
  const [deck, setDeck] = useState(() => ({
    remaining: shuffle(cards, random),
    drawn: [] as DrawnCard<Card>[],
    nextId: 0,
  }));

  const draw = () => {
    setDeck((current) => {
      const remaining = current.remaining.length > 0 ? current.remaining : shuffle(cards, random);

      if (remaining.length === 0) {
        return current;
      }

      return {
        remaining: remaining.slice(1),
        drawn: [{ id: current.nextId, card: remaining[0] }, ...current.drawn],
        nextId: current.nextId + 1,
      };
    });
  };

  const clear = () => {
    setDeck((current) => ({ ...current, drawn: [] }));
  };

  const discard = (id: number) => {
    setDeck((current) => ({
      ...current,
      drawn: current.drawn.filter((entry) => entry.id !== id),
    }));
  };

  const sort = (compare: (left: Card, right: Card) => number) => {
    setDeck((current) => ({
      ...current,
      drawn: [...current.drawn].sort((left, right) => compare(left.card, right.card)),
    }));
  };

  return {
    drawnCards: deck.drawn,
    remainingCount: deck.remaining.length,
    draw,
    clear,
    discard,
    sort,
  };
}