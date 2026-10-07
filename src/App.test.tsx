import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import fateCards from './settings/fateCards';
import opponentCards from './settings/opponentCards';
import playerCards from './settings/playerCards';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the solo helper with its card draw controls', () => {
  render(<App />);

  expect(screen.getByText("Hadrian's Wall Solo Helper")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /draw fate card/i })).toBeInTheDocument();
});

test.each([
  { deck: 'Player', action: 'As Path' },
  { deck: 'Fate', action: 'Discard' },
])('$deck cards preserve mounted controls across draws and resource updates', ({ deck, action }) => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  userEvent.click(screen.getByRole('button', { name: `Draw ${deck} Card` }));
  const originalControl = screen.getByRole('button', { name: action });

  userEvent.click(screen.getByRole('button', { name: `Draw ${deck} Card` }));
  expect(screen.getAllByRole('button', { name: action })).toContain(originalControl);

  userEvent.click(screen.getAllByRole('button', { name: '+' })[0]);
  expect(screen.getAllByRole('button', { name: action })).toContain(originalControl);

  const newerControl = screen.getAllByRole('button', { name: action })[0];
  if (deck === 'Fate') {
    userEvent.click(screen.getByRole('button', { name: 'Sort By Arrow' }));
    expect(screen.getAllByRole('button', { name: action })[0]).toBe(originalControl);
    userEvent.click(originalControl);
    expect(screen.getByText('Left : 0')).toBeInTheDocument();
    expect(screen.getByText('Right : 1')).toBeInTheDocument();
  } else {
    userEvent.click(screen.getAllByRole('button', { name: 'As Resource' })[1]);
  }
  expect(originalControl).not.toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: action })).toEqual([newerControl]);
});

test('Neutral card toggles stay with their draw instance when drawing another card and repeating a deck', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  const drawButton = screen.getByRole('button', { name: 'Draw Opponent Card' });
  userEvent.click(drawButton);
  userEvent.click(screen.getByRole('button', { name: 'Buy Goods' }));
  userEvent.click(screen.getByRole('button', { name: 'Scout' }));
  const originalGoods = screen.getByRole('button', { name: /Bought Goods/ });
  const originalScout = screen.getByRole('button', { name: /Scouted/ });

  userEvent.click(drawButton);
  expect(screen.getByRole('button', { name: /Bought Goods/ })).toBe(originalGoods);
  expect(screen.getByRole('button', { name: /Scouted/ })).toBe(originalScout);

  for (let drawCount = 2; drawCount < 13; drawCount += 1) {
    userEvent.click(drawButton);
  }

  const goodsControls = screen.getAllByRole('button', { name: /goods/i });
  const scoutControls = screen.getAllByRole('button', { name: /scout/i });
  expect(goodsControls[0]).toHaveTextContent('Buy Goods');
  expect(scoutControls[0]).toHaveTextContent('Scout');
  expect(goodsControls[12]).toBe(originalGoods);
  expect(scoutControls[12]).toBe(originalScout);

  userEvent.click(screen.getAllByRole('button', { name: '+' })[0]);
  expect(screen.getByRole('button', { name: /Bought Goods/ })).toBe(originalGoods);
  expect(screen.getByRole('button', { name: /Scouted/ })).toBe(originalScout);
});

test('rendering and rerendering the App never mutates imported card decks', () => {
  const originalFateCards = [...fateCards];
  const originalPlayerCards = [...playerCards];
  const originalNeutralCards = [...opponentCards];
  jest.spyOn(Math, 'random').mockReturnValue(0);

  const { rerender } = render(<App />);

  expect(fateCards).toEqual(originalFateCards);
  expect(playerCards).toEqual(originalPlayerCards);
  expect(opponentCards).toEqual(originalNeutralCards);

  rerender(<App />);

  expect(fateCards).toEqual(originalFateCards);
  expect(playerCards).toEqual(originalPlayerCards);
  expect(opponentCards).toEqual(originalNeutralCards);
});

test('all three deck controls draw and clear independently without restarting their piles', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  userEvent.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));

  expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
  expect(screen.getAllByText('Engineer')).toHaveLength(2);
  expect(screen.getByText('Left : 1')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Clear Fate Cards' }));

  expect(screen.queryByRole('button', { name: 'Discard' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
  expect(screen.getByText('Left : 0')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Draw Fate Card' }));

  expect(screen.getByText('Right : 1')).toBeInTheDocument();
  expect(screen.getByText('Left : 0')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Clear Player Cards' }));

  expect(screen.queryByRole('button', { name: 'As Path' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Clear Opponent Cards' }));

  expect(screen.queryByRole('button', { name: 'Buy Goods' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));

  expect(screen.getAllByText('Planner')).toHaveLength(2);
  expect(screen.queryByText('Engineer')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Discard' }));

  expect(screen.getByText('Right : 0')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeInTheDocument();
});