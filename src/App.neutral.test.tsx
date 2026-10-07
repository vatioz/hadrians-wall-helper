import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

afterEach(() => {
  jest.restoreAllMocks();
});

test('two Neutral trades and one scout spend their costs and add three invasion draws (PDF pp. 13, 19, 22)', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  const brick = within(screen.getByText('Brick').parentElement!);
  const black = within(screen.getByText('Black').parentElement!);
  userEvent.click(brick.getByRole('button', { name: '+' }));
  userEvent.click(brick.getByRole('button', { name: '+' }));
  userEvent.click(black.getByRole('button', { name: '+' }));

  userEvent.click(screen.getByRole('button', { name: 'Buy Goods' }));
  userEvent.click(screen.getByRole('button', { name: 'Buy Goods' }));
  userEvent.click(screen.getByRole('button', { name: 'Scout' }));

  expect(screen.getByText('Extra Invasion Draws: 3')).toBeInTheDocument();
  expect(screen.getByText('Resources placed: 2')).toBeInTheDocument();
  expect(screen.getByText('Soldiers placed: 1')).toBeInTheDocument();
  expect(brick.getByText('0')).toBeInTheDocument();
  expect(black.getByText('0')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Buy Goods' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Scout' })).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Discard' })).not.toBeInTheDocument();
  ['Left', 'Center', 'Right'].forEach((direction) => {
    expect(screen.getByText(`${direction} : 0`)).toBeInTheDocument();
  });
});

test('Neutral uses accumulate across cards and cleanup preserves payments, Paths, Fate cards, and piles', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  const { rerender } = render(<App />);
  userEvent.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  userEvent.click(screen.getByRole('button', { name: 'As Path' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  const brick = within(screen.getByText('Brick').parentElement!);
  const black = within(screen.getByText('Black').parentElement!);
  for (let count = 0; count < 3; count += 1) {
    userEvent.click(brick.getByRole('button', { name: '+' }));
  }
  userEvent.click(black.getByRole('button', { name: '+' }));
  userEvent.click(black.getByRole('button', { name: '+' }));
  const engineer = within(screen.getByRole('region', { name: 'Neutral card Engineer' }));
  userEvent.click(engineer.getByRole('button', { name: 'Buy Goods' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  const planner = within(screen.getByRole('region', { name: 'Neutral card Planner' }));
  userEvent.click(planner.getByRole('button', { name: 'Buy Goods' }));
  userEvent.click(planner.getByRole('button', { name: 'Buy Goods' }));
  userEvent.click(planner.getByRole('button', { name: 'Scout' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Player Card' }));
  userEvent.click(within(screen.getByText('Blue').parentElement!).getByRole('button', { name: '+' }));
  rerender(<App />);

  expect(engineer.getByText('Resources placed: 1')).toBeInTheDocument();
  expect(engineer.getByText('Soldiers placed: 0')).toBeInTheDocument();
  expect(planner.getByText('Resources placed: 2')).toBeInTheDocument();
  expect(planner.getByText('Soldiers placed: 1')).toBeInTheDocument();
  expect(screen.getByText('Extra Invasion Draws: 4')).toBeInTheDocument();
  expect(screen.getByText('Left : 1')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: 'Discard' })).toHaveLength(1);

  userEvent.click(screen.getByRole('button', { name: 'Clear Neutral Cards' }));
  expect(screen.getByText('Extra Invasion Draws: 0')).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: /Neutral card/ })).not.toBeInTheDocument();
  expect(brick.getByText('0')).toBeInTheDocument();
  expect(black.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('Large Buildings')).toBeInTheDocument();
  expect(screen.getByText('Left : 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'As Path' })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  const trainer = within(screen.getByRole('region', { name: 'Neutral card Trainer' }));
  expect(trainer.getByText('Resources placed: 0')).toBeInTheDocument();
  expect(trainer.getByText('Soldiers placed: 0')).toBeInTheDocument();
});

test('unpaid and batched Neutral uses cannot overdraw resources or add unpaid placements', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  const trades = screen.getAllByRole('button', { name: 'Buy Goods' });
  const scouts = screen.getAllByRole('button', { name: 'Scout' });
  trades.forEach((button) => expect(button).toBeDisabled());
  scouts.forEach((button) => expect(button).toBeDisabled());
  fireEvent.click(trades[0]);
  fireEvent.click(scouts[0]);
  expect(screen.getByText('Extra Invasion Draws: 0')).toBeInTheDocument();
  const brick = within(screen.getByText('Brick').parentElement!);
  const black = within(screen.getByText('Black').parentElement!);
  userEvent.click(brick.getByRole('button', { name: '+' }));
  userEvent.click(black.getByRole('button', { name: '+' }));

  act(() => {
    fireEvent.click(trades[0]);
    fireEvent.click(trades[0]);
    fireEvent.click(trades[1]);
    fireEvent.click(scouts[0]);
    fireEvent.click(scouts[1]);
  });
  expect(screen.getByText('Extra Invasion Draws: 2')).toBeInTheDocument();
  expect(brick.getByText('0')).toBeInTheDocument();
  expect(black.getByText('0')).toBeInTheDocument();
  const planner = within(screen.getByRole('region', { name: 'Neutral card Planner' }));
  const engineer = within(screen.getByRole('region', { name: 'Neutral card Engineer' }));
  expect(planner.getByText('Resources placed: 1')).toBeInTheDocument();
  expect(planner.getByText('Soldiers placed: 1')).toBeInTheDocument();
  expect(engineer.getByText('Resources placed: 0')).toBeInTheDocument();
  expect(engineer.getByText('Soldiers placed: 0')).toBeInTheDocument();
});

test.each([
  { action: 'Buy Goods', hint: 'Spend 1 Resource (Brick); add 1 invasion draw.' },
  { action: 'Scout', hint: 'Spend 1 Soldier (Black); add 1 invasion draw.' },
])('$action exposes its payment hint even when unavailable', async ({ action, hint }) => {
  render(<App />);
  userEvent.click(screen.getByRole('button', { name: 'Draw Opponent Card' }));
  const control = screen.getByRole('button', { name: action });
  expect(control).toBeDisabled();
  expect(control).toHaveTextContent('1');
  userEvent.hover(control.parentElement!);
  expect(await screen.findByRole('tooltip')).toHaveTextContent(hint);
});