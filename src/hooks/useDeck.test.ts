import { act, renderHook } from '@testing-library/react';
import { shuffle, useDeck } from './useDeck';

test('shuffle returns a deterministic permutation without mutating its source or losing equal cards', () => {
  const source = Object.freeze(['Fighter', 'Ranger', 'Trainer', 'Fighter']);

  const shuffled = shuffle(source, () => 0);

  expect(shuffled).toEqual(['Ranger', 'Trainer', 'Fighter', 'Fighter']);
  expect(shuffled).not.toBe(source);
  expect(source).toEqual(['Fighter', 'Ranger', 'Trainer', 'Fighter']);
});

test('shuffle can select the current position at the upper end of the random range', () => {
  const source = Object.freeze(['Fighter', 'Ranger', 'Trainer']);

  expect(shuffle(source, () => 0.999999)).toEqual(['Fighter', 'Ranger', 'Trainer']);
  expect(source).toEqual(['Fighter', 'Ranger', 'Trainer']);
});

test('totalCount stays at the full pile size while remainingCount falls and reshuffles', () => {
  const source = Object.freeze(['Fighter', 'Ranger']);
  const { result } = renderHook(() => useDeck(source, () => 0, undefined, { reshuffleWhenEmpty: true }));

  expect(result.current.totalCount).toBe(2);
  act(() => result.current.draw());
  act(() => result.current.draw());
  expect(result.current.remainingCount).toBe(0);
  expect(result.current.totalCount).toBe(2);
  act(() => result.current.clear());
  act(() => result.current.draw());
  expect(result.current.remainingCount).toBe(1);
  expect(result.current.totalCount).toBe(2);
});

test('drawing displays exactly one card and consumes one card from the remaining pile', () => {
  const source = Object.freeze(['Fighter', 'Ranger', 'Trainer']);
  const { result } = renderHook(() => useDeck(source, () => 0));

  expect(result.current.drawnCards).toEqual([]);
  expect(result.current.remainingCount).toBe(3);

  act(() => result.current.draw());

  expect(result.current.drawnCards.map((entry) => entry.card)).toEqual(['Ranger']);
  expect(result.current.remainingCount).toBe(2);
  expect(source).toEqual(['Fighter', 'Ranger', 'Trainer']);
});

test('sorting reorders only the display and preserves drawn instances and the remaining pile', () => {
  const source = Object.freeze(['Fighter', 'Ranger', 'Trainer']);
  const { result } = renderHook(() => useDeck(source, () => 0));

  act(() => {
    result.current.draw();
    result.current.draw();
  });

  const previousDisplay = Object.freeze(result.current.drawnCards);

  act(() => result.current.sort((left, right) => left.localeCompare(right)));

  expect(result.current.drawnCards.map((entry) => entry.card)).toEqual(['Ranger', 'Trainer']);
  expect(result.current.drawnCards[0]).toBe(previousDisplay[1]);
  expect(result.current.drawnCards[1]).toBe(previousDisplay[0]);
  expect(previousDisplay.map((entry) => entry.card)).toEqual(['Trainer', 'Ranger']);
  expect(result.current.remainingCount).toBe(1);
  expect(source).toEqual(['Fighter', 'Ranger', 'Trainer']);
});

test('discarding one instance retains an equal-content card and never refills the pile', () => {
  const card = Object.freeze({ picts_direction: 'center', goods: 3 });
  const source = Object.freeze([card, card]);
  const { result } = renderHook(() => useDeck(source, () => 0));

  act(() => {
    result.current.draw();
    result.current.draw();
  });

  const [discarded, retained] = result.current.drawnCards;
  expect(discarded.card).toEqual(retained.card);
  expect(discarded.id).not.toBe(retained.id);

  act(() => result.current.discard(discarded.id));

  expect(result.current.drawnCards).toEqual([retained]);
  expect(result.current.remainingCount).toBe(0);

  act(() => result.current.discard(discarded.id));

  expect(result.current.drawnCards).toEqual([retained]);
  expect(result.current.remainingCount).toBe(0);
  expect(source).toEqual([card, card]);
});

test('Player, Neutral, and Fate hooks keep independent draw piles and displays', () => {
  const source = Object.freeze(['first', 'second', 'third']);
  const { result } = renderHook(() => ({
    player: useDeck(source, () => 0),
    neutral: useDeck(source, () => 0),
    fate: useDeck(source, () => 0),
  }));

  act(() => {
    result.current.player.draw();
    result.current.player.draw();
    result.current.player.draw();
    result.current.player.draw();
  });

  expect(result.current.player.drawnCards.map((entry) => entry.card)).toEqual(['first', 'third', 'second']);
  expect(result.current.player.remainingCount).toBe(0);
  expect(result.current.player.canDraw).toBe(false);
  expect(result.current.neutral.drawnCards).toEqual([]);
  expect(result.current.neutral.remainingCount).toBe(3);
  expect(result.current.fate.drawnCards).toEqual([]);
  expect(result.current.fate.remainingCount).toBe(3);

  act(() => {
    result.current.neutral.draw();
    result.current.fate.draw();
    result.current.player.clear();
  });

  expect(result.current.player.drawnCards).toEqual([]);
  expect(result.current.player.remainingCount).toBe(0);
  expect(result.current.neutral.drawnCards.map((entry) => entry.card)).toEqual(['second']);
  expect(result.current.fate.drawnCards.map((entry) => entry.card)).toEqual(['second']);
});

test('clearing displayed cards does not replenish the draw pile', () => {
  const source = Object.freeze(['Fighter', 'Ranger', 'Trainer']);
  const { result } = renderHook(() => useDeck(source, () => 0));

  act(() => result.current.draw());
  act(() => result.current.clear());

  expect(result.current.drawnCards).toEqual([]);
  expect(result.current.remainingCount).toBe(2);

  act(() => result.current.draw());

  expect(result.current.drawnCards.map((entry) => entry.card)).toEqual(['Trainer']);
  expect(result.current.remainingCount).toBe(1);
});

test('a reshuffling pile is exhausted before the next draw reshuffles it, without repeating an instance within a cycle', () => {
  const source = Object.freeze(['Fighter', 'Ranger', 'Trainer']);
  const { result } = renderHook(() => useDeck(source, () => 0, undefined, { reshuffleWhenEmpty: true }));

  act(() => {
    result.current.draw();
    result.current.draw();
    result.current.draw();
  });

  expect(result.current.drawnCards.map((entry) => entry.card)).toEqual(['Fighter', 'Trainer', 'Ranger']);
  expect(result.current.remainingCount).toBe(0);
  const firstCycleIds = result.current.drawnCards.map((entry) => entry.id);
  expect(new Set(firstCycleIds).size).toBe(3);

  act(() => result.current.clear());
  act(() => result.current.draw());

  expect(result.current.drawnCards.map((entry) => entry.card)).toEqual(['Ranger']);
  expect(result.current.remainingCount).toBe(2);
  expect(firstCycleIds).not.toContain(result.current.drawnCards[0].id);
  expect(source).toEqual(['Fighter', 'Ranger', 'Trainer']);
});

test('a reshuffle excludes cards still on display and returns only cards that left display', () => {
  const source = Object.freeze(['Fighter', 'Ranger', 'Trainer']);
  const { result } = renderHook(() => useDeck(source, () => 0, undefined, { reshuffleWhenEmpty: true }));

  act(() => {
    result.current.draw();
    result.current.draw();
    result.current.draw();
  });
  const [newest, middle, oldest] = result.current.drawnCards;

  act(() => result.current.discard(newest.id));
  expect(result.current.canDraw).toBe(true);

  act(() => result.current.draw());

  expect(result.current.drawnCards.map((entry) => entry.card)).toEqual([newest.card, middle.card, oldest.card]);
  expect(result.current.drawnCards[1]).toBe(middle);
  expect(result.current.drawnCards[2]).toBe(oldest);
  expect(result.current.drawnCards[0].id).not.toBe(newest.id);
  expect(result.current.remainingCount).toBe(0);
  expect(result.current.canDraw).toBe(false);
});

test('a reshuffling pile cannot draw while every card is still on display', () => {
  const source = Object.freeze(['Fighter', 'Ranger']);
  const { result } = renderHook(() => useDeck(source, () => 0, undefined, { reshuffleWhenEmpty: true }));

  act(() => {
    result.current.draw();
    result.current.draw();
  });
  const before = result.current.drawnCards;

  expect(result.current.canDraw).toBe(false);
  act(() => result.current.draw());

  expect(result.current.drawnCards).toBe(before);
  expect(result.current.remainingCount).toBe(0);
});

test('a pile without reshuffling reports it cannot draw once empty and never refills', () => {
  const source = Object.freeze(['Fighter', 'Ranger']);
  const { result } = renderHook(() => useDeck(source, () => 0));

  act(() => {
    result.current.draw();
    result.current.draw();
  });
  act(() => result.current.clear());

  expect(result.current.canDraw).toBe(false);
  act(() => result.current.draw());

  expect(result.current.drawnCards).toEqual([]);
  expect(result.current.remainingCount).toBe(0);
});
