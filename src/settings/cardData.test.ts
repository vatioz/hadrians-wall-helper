import fateCards from './fateCards';
import opponentCards from './opponentCards';
import playerCards from './playerCards';

describe.each([
  ['Player', playerCards],
  ['Neutral', opponentCards],
])('%s card reference data', (_deckName, cards) => {
  test('contains 12 distinct Player cards (PDF pp. 2, 22)', () => {
    expect(cards).toHaveLength(12);
    expect(new Set(cards.map((card) => card.name)).size).toBe(12);
  });

  test('Ranger awards 1, 2, 3 VP for 1, 3, 5 completed scouting columns (PDF p. 23)', () => {
    expect(cards.find((card) => card.name === 'Ranger')?.score).toEqual({
      1: 1,
      3: 2,
      5: 3,
    });
  });

  test.each([
    ['Engineer', { 2: 1, 4: 2, 6: 3 }],
    ['Planner', { 2: 1, 4: 2, 5: 3 }],
    ['Trainer', { 4: 1, 8: 2, 12: 3 }],

    ['Vanguard', { 1: 1, 2: 2, 3: 3 }],
    ['Forager', { 3: 1, 6: 2, 9: 3 }],
    ['Pontiff', { 1: 1, 2: 2, 3: 3 }],

    ['Merchant', { 4: 1, 6: 2, 8: 3 }],
    ['Aristocrat', { 4: 1, 2: 2, 0: 3 }],
    ['Defender', { 1: 1, 2: 2, 3: 3 }],

    ['Architect', { 1: 1, 2: 2, 3: 3 }],
    ['Fighter', { 1: 1, 2: 2, 3: 3 }],
  ])('%s Path scoring matches the rulebook (PDF p. 23)', (name, score) => {
    expect(cards.find((card) => card.name === name)?.score).toEqual(score);
  });

  test.each([
    { name: 'Trainer', resources: ['brick', 'purple'], goods: '4', scout: 'S', page: 5 },
    { name: 'Defender', resources: ['blue', 'brick'], goods: '1', scout: 'L', page: 5 },
    { name: 'Fighter', resources: ['black'], goods: '5', scout: 'Square', page: 13 },
    { name: 'Vanguard', resources: ['blue', 'yellow'], goods: '2', scout: 'S', page: 19 },
  ])('$name resource, Trade Good, and Scouting Pattern example matches PDF p. $page', ({ name, resources, goods, scout }) => {
    const card = cards.find((candidate) => candidate.name === name);

    expect(card?.resources.slice().sort()).toEqual(resources);
    expect(card).toMatchObject({ goods, scout });
  });

  test('fields use rulebook resource kinds and Trade Goods, and supported pattern labels (PDF pp. 2, 13; helper contract)', () => {
    cards.forEach((card) => {
      card.resources.forEach((resource) => {
        expect(['black', 'blue', 'purple', 'yellow', 'brick']).toContain(resource);
      });
      expect(card.goods).toMatch(/^[1-6]$/);
      expect(['Line', 'Square', 'T', 'L', 'S']).toContain(card.scout);
    });
  });
});

test('Neutral uses matching Player-card definitions without shared mutable data (PDF p. 22; helper contract)', () => {
  expect(opponentCards).not.toBe(playerCards);

  playerCards.forEach((playerCard) => {
    const neutralCard = opponentCards.find((card) => card.name === playerCard.name);

    expect(neutralCard).toEqual(playerCard);
    expect(neutralCard).not.toBe(playerCard);
    expect(neutralCard?.score).not.toBe(playerCard.score);
    expect(neutralCard?.resources).not.toBe(playerCard.resources);
  });
});

test.each([
  {
    example: 'centre-attack',
    page: 20,
    card: {
      picts_direction: 'center',
      goods: 3,
      gladiator: 2,
      resource: ['black', 'blue', 'blue', 'brick', 'purple', 'purple', 'yellow', 'yellow'],
    },
  },
  {
    example: 'right-attack',
    page: 20,
    card: {
      picts_direction: 'right',
      goods: 2,
      gladiator: 1,
      resource: ['black', 'black', 'blue', 'blue', 'blue', 'brick', 'purple', 'yellow'],
    },
  },
])('the Fate deck includes the $example card illustrated on PDF p. $page', ({ card }) => {
  expect(fateCards.map((fateCard) => ({
    ...fateCard,
    resource: fateCard.resource.slice().sort(),
  }))).toContainEqual(card);
});

test('Fate fields use rulebook resource kinds, Trade Goods, and Cohort directions (PDF pp. 2, 13, 20)', () => {
  fateCards.forEach((card) => {
    card.resource.forEach((resource) => {
      expect(['black', 'blue', 'purple', 'yellow', 'brick']).toContain(resource);
    });
    expect([1, 2, 3, 4, 5, 6]).toContain(card.goods);
    expect(['left', 'center', 'right']).toContain(card.picts_direction);
  });
});

test('the Fate deck contains 48 cards (PDF p. 2)', () => {
  expect(fateCards).toHaveLength(48);
});