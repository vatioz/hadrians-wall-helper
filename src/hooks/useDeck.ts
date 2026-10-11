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

export interface DeckState<Card> {
  remaining: Card[];
  drawn: DrawnCard<Card>[];
  nextId: number;
}

export interface DeckOptions {
  /** When true, an empty pile reshuffles every card that is not currently displayed. */
  reshuffleWhenEmpty?: boolean;
}

function createDeckState<Card>(cards: readonly Card[], random: () => number): DeckState<Card> {
  return {
    remaining: shuffle(cards, random),
    drawn: [],
    nextId: 0,
  };
}

function reshufflePile<Card>(cards: readonly Card[], drawn: readonly DrawnCard<Card>[], random: () => number): Card[] {
  const available = [...cards];

  drawn.forEach(({ card }) => {
    // Restored state holds copies rather than the original card objects, so match by content.
    const index = available.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(card));
    if (index >= 0) {
      available.splice(index, 1);
    }
  });

  return shuffle(available, random);
}

export function useDeck<Card>(
  cards: readonly Card[],
  random: () => number = Math.random,
  initialState?: DeckState<Card>,
  { reshuffleWhenEmpty = false }: DeckOptions = {},
) {
  const [deck, setDeck] = useState<DeckState<Card>>(() => initialState ?? createDeckState(cards, random));

  const draw = () => {
    setDeck((current) => {
      const remaining = current.remaining.length > 0 || !reshuffleWhenEmpty
        ? current.remaining
        : reshufflePile(cards, current.drawn, random);

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

  const reset = () => {
    setDeck(createDeckState(cards, random));
  };

  return {
    state: deck,
    drawnCards: deck.drawn,
    remainingCount: deck.remaining.length,
    totalCount: cards.length,
    canDraw: deck.remaining.length > 0 || (reshuffleWhenEmpty && cards.length > deck.drawn.length),
    draw,
    clear,
    discard,
    sort,
    reset,
  };
}