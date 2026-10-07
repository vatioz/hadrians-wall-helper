import { act, fireEvent, render, screen, within } from '@testing-library/react';
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

test('Neutral card toggles stay with their draw instance when drawing another card and repeating a deck', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  const drawButton = screen.getByRole('button', { name: 'Draw Opponent Card' });
  await user.click(drawButton);
  await user.click(screen.getByRole('button', { name: 'Buy Goods' }));
  await user.click(screen.getByRole('button', { name: 'Scout' }));
  const originalGoods = screen.getByRole('button', { name: /Bought Goods/ });
  const originalScout = screen.getByRole('button', { name: /Scouted/ });

  await user.click(drawButton);
  expect(screen.getByRole('button', { name: /Bought Goods/ })).toBe(originalGoods);
  expect(screen.getByRole('button', { name: /Scouted/ })).toBe(originalScout);

  for (let drawCount = 2; drawCount < 13; drawCount += 1) {
    await user.click(drawButton);
  }

  const goodsControls = screen.getAllByRole('button', { name: /goods/i });
  const scoutControls = screen.getAllByRole('button', { name: /scout/i });
  expect(goodsControls[0]).toHaveTextContent('Buy Goods');
  expect(scoutControls[0]).toHaveTextContent('Scout');
  expect(goodsControls[12]).toBe(originalGoods);
  expect(scoutControls[12]).toBe(originalScout);

  await user.click(screen.getAllByRole('button', { name: '+' })[0]);
  expect(screen.getByRole('button', { name: /Bought Goods/ })).toBe(originalGoods);
  expect(screen.getByRole('button', { name: /Scouted/ })).toBe(originalScout);
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

  await user.click(screen.getByRole('button', { name: 'Clear Fate Cards' }));

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

  await user.click(screen.getByRole('button', { name: 'Clear Opponent Cards' }));

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
  await user.click(screen.getByRole('button', { name: 'Clear Fate Cards' }));
  await user.click(screen.getByRole('button', { name: 'Clear Player Cards' }));
  await user.click(screen.getByRole('button', { name: 'Clear Opponent Cards' }));

  expect(log).not.toHaveBeenCalled();
  expect(debug).not.toHaveBeenCalled();
});