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

test('every Year matches the year-track flags (PDF p. 5)', () => {
  expect(rounds.map(({ round, easy, medium, hard, valour }) => ({
    round, easy, medium, hard, valour,
  }))).toEqual([
    { round: 1, easy: 1, medium: 1, hard: 1, valour: 1 },
    { round: 2, easy: 2, medium: 2, hard: 3, valour: 2 },
    { round: 3, easy: 3, medium: 4, hard: 5, valour: 2 },
    { round: 4, easy: 4, medium: 6, hard: 7, valour: 3 },
    { round: 5, easy: 6, medium: 8, hard: 9, valour: 3 },
    { round: 6, easy: 8, medium: 10, hard: 12, valour: 4 },
  ]);
});