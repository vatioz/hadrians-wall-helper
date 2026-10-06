import rounds from './rounds';

test('the reference lists all six Years (PDF pp. 2, 4)', () => {
  expect(rounds.map((year) => year.round)).toEqual([1, 2, 3, 4, 5, 6]);
});

test('Year 3 has 3 Easy draws, 5 Hard draws, and 2 Valour (PDF p. 20)', () => {
  expect(rounds.find((year) => year.round === 3)).toMatchObject({
    easy: 3,
    hard: 5,
    valour: 2,
  });
});

test('Year 3 has 4 Medium draws on the illustrated yellow flag (PDF p. 20)', () => {
  expect(rounds.find((year) => year.round === 3)?.medium).toBe(4);
});