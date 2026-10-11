import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';
import { SESSION_STORAGE_KEY } from './gameSession';
import fateCards from './settings/fateCards';

afterEach(() => {
  vi.restoreAllMocks();
});

const fateTotal = fateCards.length;

const fateDeckText = (remaining: number) => `Deck: ${remaining}/${fateTotal}`;

const drawFate = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /draw fate card/i }));
};

test('a reload restores the Fate deck position from the saved session', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const first = render(<App />);
  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();

  await drawFate(user);
  expect(screen.getByText(fateDeckText(fateTotal - 1))).toBeInTheDocument();
  first.unmount();

  render(<App />);
  expect(screen.getByText(fateDeckText(fateTotal - 1))).toBeInTheDocument();
});

test('corrupted stored JSON falls back to a fresh game', () => {
  localStorage.setItem(SESSION_STORAGE_KEY, '{not json');
  render(<App />);

  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();
});

test('an unsupported session version falls back to a fresh game', () => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ version: 999 }));
  render(<App />);

  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();
});

const savedSession = () => {
  const first = render(<App />);
  const saved = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)!);
  first.unmount();
  return saved;
};

test('a negative resource count in storage falls back to a fresh game', async () => {
  const user = userEvent.setup();
  const session = savedSession();
  session.resources.amount.black = -1;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  render(<App />);
  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();
  await drawFate(user);
  expect(screen.getByText(fateDeckText(fateTotal - 1))).toBeInTheDocument();
});

test('a repeated Fate pile index in storage falls back to a fresh game', () => {
  const session = savedSession();
  session.fate.remaining[1] = session.fate.remaining[0];
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  render(<App />);
  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();
});

test('play keeps working when localStorage throws', async () => {
  const user = userEvent.setup();
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  render(<App />);

  await drawFate(user);
  expect(screen.getByText(fateDeckText(fateTotal - 1))).toBeInTheDocument();
});

test('cancelling New Game keeps the current session', async () => {
  const user = userEvent.setup();
  render(<App />);
  await drawFate(user);

  await user.click(screen.getByRole('button', { name: 'New Game' }));
  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText(fateDeckText(fateTotal - 1))).toBeInTheDocument();
});

test('confirming New Game resets the session and the reset is persisted', async () => {
  const user = userEvent.setup();
  const first = render(<App />);
  await drawFate(user);

  await user.click(screen.getByRole('button', { name: 'New Game' }));
  await user.click(screen.getByRole('button', { name: 'Start new game' }));

  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();
  first.unmount();

  render(<App />);
  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();
});

test('New Game still resets when localStorage writes throw', async () => {
  const user = userEvent.setup();
  render(<App />);
  await drawFate(user);

  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  await user.click(screen.getByRole('button', { name: 'New Game' }));
  await user.click(screen.getByRole('button', { name: 'Start new game' }));

  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText(fateDeckText(fateTotal))).toBeInTheDocument();
});
