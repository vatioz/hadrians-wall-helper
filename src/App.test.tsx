import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';
import fateCards from './settings/fateCards';
import opponentCards from './settings/opponentCards';
import playerCards from './settings/playerCards';

afterEach(() => {
  vi.restoreAllMocks();
});

test.each([
  { deck: 'Player', counts: { Black: 1, Blue: 1, Purple: 0, Yellow: 0, Brick: 1 } },
  { deck: 'Fate', counts: { Black: 3, Blue: 1, Purple: 1, Yellow: 2, Brick: 2 } },
])('$deck card resources preserve a queued manual increment and immediately update every counter', async ({ deck, counts }) => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  await user.click(screen.getByRole('button', { name: `Draw ${deck} Card` }));

  const blackCounter = within(screen.getByText('Black').parentElement!);
  const collectButton = screen.getByRole('button', { name: 'As Resource' });

  act(() => {
    fireEvent.click(blackCounter.getByRole('button', { name: '+' }));
    fireEvent.click(collectButton);
  });

  Object.entries(counts).forEach(([label, count]) => {
    expect(within(screen.getByText(label).parentElement!).getByText(String(count))).toBeInTheDocument();
  });
  expect(screen.queryByRole('button', { name: 'As Resource' })).not.toBeInTheDocument();

  await user.click(blackCounter.getByRole('button', { name: '+' }));
  expect(blackCounter.getByText(String(counts.Black + 1))).toBeInTheDocument();
  await user.click(blackCounter.getByRole('button', { name: '-' }));
  expect(blackCounter.getByText(String(counts.Black))).toBeInTheDocument();
});

test('renders the solo helper with its card draw controls', () => {
  render(<App />);

  expect(screen.getByText("Hadrian's Wall Solo Helper")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /draw fate card/i })).toBeInTheDocument();
});

test('the round reference keeps all six Years and their labeled values grouped', () => {
  render(<App />);

  const reference = within(screen.getByRole('region', { name: 'Round reference' }));
  expect(reference.getAllByRole('group')).toHaveLength(6);
  const expectedValues = [
    [1, 1, 1, 1],
    [2, 2, 3, 2],
    [3, 4, 5, 2],
    [4, 6, 7, 3],
    [6, 8, 9, 3],
    [8, 10, 12, 4],
  ];

  expectedValues.forEach((values, index) => {
    const year = within(reference.getByRole('group', { name: `Round ${index + 1}` }));
    expect(year.getByText(`Round ${index + 1}`)).toBeInTheDocument();
    ['Easy', 'Medium', 'Hard', 'Valour'].forEach((label, valueIndex) => {
      const row = year.getByText(label).parentElement!;
      expect(within(row).getByText(String(values[valueIndex]))).toBeInTheDocument();
    });
  });
});

test.each([
  { deck: 'Player', action: 'As Path' },
  { deck: 'Fate', action: 'Discard' },
])('$deck cards preserve mounted controls across draws and resource updates', async ({ deck, action }) => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  await user.click(screen.getByRole('button', { name: `Draw ${deck} Card` }));
  const originalControl = screen.getByRole('button', { name: action });

  await user.click(screen.getByRole('button', { name: `Draw ${deck} Card` }));
  expect(screen.getAllByRole('button', { name: action })).toContain(originalControl);

  await user.click(screen.getAllByRole('button', { name: '+' })[0]);
  expect(screen.getAllByRole('button', { name: action })).toContain(originalControl);

  const newerControl = screen.getAllByRole('button', { name: action })[0];
  if (deck === 'Fate') {
    await user.click(screen.getByRole('button', { name: 'Sort By Arrow' }));
    expect(screen.getAllByRole('button', { name: action })[0]).toBe(originalControl);
    await user.click(originalControl);
    expect(screen.getByText('Left : 0')).toBeInTheDocument();
    expect(screen.getByText('Right : 1')).toBeInTheDocument();
  } else {
    await user.click(screen.getAllByRole('button', { name: 'As Resource' })[1]);
  }
  expect(originalControl).not.toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: action })).toEqual([newerControl]);
});

test('Neutral placements stay with their draw instance when drawing another card and repeating a deck', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  const drawButton = screen.getByRole('button', { name: 'Draw Opponent Card' });
  await user.click(drawButton);
  await user.click(within(screen.getByText('Brick').parentElement!).getByRole('button', { name: '+' }));
  await user.click(within(screen.getByText('Black').parentElement!).getByRole('button', { name: '+' }));
  const originalGoods = screen.getByRole('button', { name: 'Buy Goods' });
  const originalScout = screen.getByRole('button', { name: 'Scout' });
  const originalCard = within(screen.getByRole('region', { name: 'Neutral card Engineer' }));
  await user.click(screen.getByRole('button', { name: 'Buy Goods' }));
  await user.click(screen.getByRole('button', { name: 'Scout' }));

  await user.click(drawButton);
  expect(screen.getAllByRole('button', { name: 'Buy Goods' })).toContain(originalGoods);
  expect(screen.getAllByRole('button', { name: 'Scout' })).toContain(originalScout);

  for (let drawCount = 2; drawCount < 13; drawCount += 1) {
    await user.click(drawButton);
  }

  const goodsControls = screen.getAllByRole('button', { name: 'Buy Goods' });
  const scoutControls = screen.getAllByRole('button', { name: 'Scout' });
  const newerEngineer = within(screen.getAllByRole('region', { name: 'Neutral card Engineer' })[0]);
  expect(newerEngineer.getByText('Resources placed: 0')).toBeInTheDocument();
  expect(newerEngineer.getByText('Soldiers placed: 0')).toBeInTheDocument();
  expect(goodsControls[12]).toBe(originalGoods);
  expect(scoutControls[12]).toBe(originalScout);

  await user.click(screen.getAllByRole('button', { name: '+' })[0]);
  expect(originalCard.getByText('Resources placed: 1')).toBeInTheDocument();
  expect(originalCard.getByText('Soldiers placed: 1')).toBeInTheDocument();
  expect(screen.getByText('Extra Invasion Draws: 2')).toBeInTheDocument();
});

test('rendering and rerendering the App never mutates imported card decks', () => {
  const originalFateCards = [...fateCards];
  const originalPlayerCards = [...playerCards];
  const originalNeutralCards = [...opponentCards];
  vi.spyOn(Math, 'random').mockReturnValue(0);

  const { rerender } = render(<App />);

  expect(fateCards).toEqual(originalFateCards);
  expect(playerCards).toEqual(originalPlayerCards);
  expect(opponentCards).toEqual(originalNeutralCards);

  rerender(<App />);

  expect(fateCards).toEqual(originalFateCards);
  expect(playerCards).toEqual(originalPlayerCards);
  expect(opponentCards).toEqual(originalNeutralCards);
});

test('all three deck controls draw and clear independently without restarting their piles', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));

  expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
  expect(screen.getAllByText('Engineer')).toHaveLength(2);
  expect(screen.getByText('Left : 1')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear Invasion' }));

  expect(screen.queryByRole('button', { name: 'Discard' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
  expect(screen.getByText('Left : 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));

  expect(screen.getByText('Right : 1')).toBeInTheDocument();
  expect(screen.getByText('Left : 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear Player Cards' }));

  expect(screen.queryByRole('button', { name: 'As Path' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear Neutral Cards' }));

  expect(screen.queryByRole('button', { name: 'Buy Goods' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));

  expect(screen.getAllByText('Planner')).toHaveLength(2);
  expect(screen.queryByText('Engineer')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Discard' }));

  expect(screen.getByText('Right : 0')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
});

test('normal game interactions do not emit debug output', async () => {
  const user = userEvent.setup();
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  await user.click(screen.getAllByRole('button', { name: '+' })[0]);
  await user.click(screen.getByRole('button', { name: 'Clear Invasion' }));
  await user.click(screen.getByRole('button', { name: 'Clear Player Cards' }));
  await user.click(screen.getByRole('button', { name: 'Clear Neutral Cards' }));

  expect(log).not.toHaveBeenCalled();
  expect(debug).not.toHaveBeenCalled();
});

test.each([
  { name: 'Clear Player Cards', hint: 'Remove displayed Player cards for the next Year; keep Paths and the remaining deck.' },
  { name: 'Clear Neutral Cards', hint: 'After resolving the invasion, remove Neutral cards, placements and extra draws. No refunds or reshuffling.' },
  { name: 'Clear Invasion', hint: 'Remove revealed Fate cards and attack totals after resolving the invasion. Do not reshuffle the deck.' },
  { name: 'Zero Resources', hint: 'Set available resource counters to zero; keep cards, Neutral placements and Paths.' },
])('$name has an explicit visible label and explains cleanup on hover and focus', async ({ name, hint }) => {
  const user = userEvent.setup();
  render(<App />);
  const control = screen.getByRole('button', { name });
  expect(control).toHaveTextContent(name);
  const matches = control.matches.bind(control);
  vi.spyOn(control, 'matches').mockImplementation((selector) => (
    selector === ':focus-visible' ? document.activeElement === control : matches(selector)
  ));
  while (document.activeElement !== control) {
    await user.tab();
  }
  expect(control).toHaveFocus();
  expect(await screen.findByRole('tooltip')).toHaveTextContent(hint);
  await user.tab();
  await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  await user.hover(control);
  expect(await screen.findByRole('tooltip')).toHaveTextContent(hint);
});

test('cleanup controls preserve Paths and never refund Neutral payments or replenish decks', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  await user.click(screen.getAllByRole('button', { name: 'As Path' })[0]);
  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  for (const label of ['Brick', 'Black']) {
    const counter = within(screen.getByText(label).parentElement!);
    await user.click(counter.getByRole('button', { name: '+' }));
    await user.click(counter.getByRole('button', { name: '+' }));
  }
  await user.click(screen.getByRole('button', { name: 'Buy Goods' }));
  await user.click(screen.getByRole('button', { name: 'Scout' }));

  await user.click(screen.getByRole('button', { name: 'Zero Resources' }));
  ['Black', 'Blue', 'Purple', 'Yellow', 'Brick'].forEach((label) => {
    expect(within(screen.getByText(label).parentElement!).getByText('0')).toBeInTheDocument();
  });
  expect(screen.getByText('Resources placed: 1')).toBeInTheDocument();
  expect(screen.getByText('Soldiers placed: 1')).toBeInTheDocument();
  expect(screen.getByText('Extra Invasion Draws: 2')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  expect(screen.getByText('Left : 1')).toBeInTheDocument();
  expect(screen.getByText('Completed Citizen Tracks')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear Player Cards' }));
  expect(screen.queryByRole('button', { name: 'As Path' })).not.toBeInTheDocument();
  expect(screen.getByText('Extra Invasion Draws: 2')).toBeInTheDocument();
  expect(screen.getByText('Left : 1')).toBeInTheDocument();
  expect(screen.getByText('Completed Citizen Tracks')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear Invasion' }));
  expect(screen.queryByRole('button', { name: 'Discard' })).not.toBeInTheDocument();
  expect(screen.getByText('Left : 0')).toBeInTheDocument();
  expect(screen.getByText('Extra Invasion Draws: 2')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear Neutral Cards' }));
  expect(screen.getByText('Extra Invasion Draws: 0')).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: /Neutral card/ })).not.toBeInTheDocument();
  expect(screen.getByText('Completed Citizen Tracks')).toBeInTheDocument();
  ['Brick', 'Black'].forEach((label) => {
    expect(within(screen.getByText(label).parentElement!).getByText('0')).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  expect(screen.getByRole('region', { name: 'Neutral card Planner' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  expect(screen.getByText('Trainer')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  expect(screen.getByText('Right : 1')).toBeInTheDocument();
});

test('holding a cleanup button exposes its hint on touch without clearing cards', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  const control = screen.getByRole('button', { name: 'Clear Neutral Cards' });
  const touch = { identifier: 1, target: control, clientX: 10, clientY: 10 };
  fireEvent.touchStart(control, { touches: [touch], changedTouches: [touch] });
  expect(await screen.findByRole('tooltip', {}, { timeout: 2000 })).toHaveTextContent('No refunds or reshuffling.');
  expect(screen.getByRole('region', { name: /Neutral card/ })).toBeInTheDocument();
  fireEvent.touchEnd(control, { touches: [], changedTouches: [touch] });
  await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(), { timeout: 2500 });
});
