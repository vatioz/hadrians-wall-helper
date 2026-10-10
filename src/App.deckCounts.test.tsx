import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

test('each draw pile shows its full size before any draw', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  expect(screen.getByText('Deck: 48/48')).toBeInTheDocument();
  expect(screen.getAllByText('Deck: 12/12')).toHaveLength(2);
});

test('drawing from a pile lowers only that pile count by one', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  expect(screen.getByText('Deck: 47/48')).toBeInTheDocument();
  expect(screen.getAllByText('Deck: 12/12')).toHaveLength(2);

  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  expect(screen.getAllByText('Deck: 11/12')).toHaveLength(2);
  expect(screen.getByText('Deck: 47/48')).toBeInTheDocument();
});

test('clear, discard, resource and reset actions leave every deck count unchanged', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  await user.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  await user.click(screen.getByRole('button', { name: 'Discard' }));
  await user.click(screen.getByRole('button', { name: 'As Resource' }));
  await user.click(screen.getByRole('button', { name: 'Zero Resources' }));
  await user.click(screen.getByRole('button', { name: 'Clear Player Cards' }));
  await user.click(screen.getByRole('button', { name: 'Clear Neutral Cards' }));

  expect(screen.getByText('Deck: 47/48')).toBeInTheDocument();
  expect(screen.getAllByText('Deck: 11/12')).toHaveLength(2);
});

test('an empty pile shows 0 and the next draw reshuffles it to total minus one', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);

  for (let draw = 0; draw < 12; draw += 1) {
    await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  }
  expect(screen.getByText('Deck: 0/12')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  expect(screen.getByText('Deck: 11/12')).toBeInTheDocument();
  expect(screen.getByText('Deck: 12/12')).toBeInTheDocument();
});
