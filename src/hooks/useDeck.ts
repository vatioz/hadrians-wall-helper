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

function createDeckState<Card>(cards: readonly Card[], random: () => number): DeckState<Card> {
  return {
    remaining: shuffle(cards, random),
    drawn: [],
    nextId: 0,
  };
}

export function useDeck<Card>(
  cards: readonly Card[],
  random: () => number = Math.random,
  initialState?: DeckState<Card>,
) {
  const [deck, setDeck] = useState<DeckState<Card>>(() => initialState ?? createDeckState(cards, random));

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

  const reset = () => {
    setDeck(createDeckState(cards, random));
  };

  return {
    state: deck,
    drawnCards: deck.drawn,
    remainingCount: deck.remaining.length,
    totalCount: cards.length,
    draw,
    clear,
    discard,
    sort,
    reset,
  };
}