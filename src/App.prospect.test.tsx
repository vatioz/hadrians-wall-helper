import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

test('the chosen Prospect retains its information and grants its reward only once (PDF pp. 4-5)', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  const draw = screen.getByRole('button', { name: 'Draw Player Card' });
  const clear = screen.getByRole('button', { name: 'Clear Player Cards' });
  userEvent.click(draw);
  userEvent.click(clear);
  userEvent.click(draw);
  userEvent.click(clear);
  userEvent.click(draw);
  userEvent.click(draw);

  userEvent.click(screen.getAllByRole('button', { name: 'As Path' })[0]);
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(screen.getByText('Completed Wall Guard Sections')).toBeInTheDocument();
  expect(screen.getByText('3 : 3VP')).toBeInTheDocument();
  ['Black', 'Blue', 'Purple', 'Yellow', 'Brick'].forEach((label) => {
    expect(within(screen.getByText(label).parentElement!).getByText('0')).toBeInTheDocument();
  });

  userEvent.click(screen.getByRole('button', { name: 'As Resource' }));

  const prospect = within(screen.getByRole('region', { name: 'Current Prospect' }));
  expect(prospect.getByText('Trainer')).toBeInTheDocument();
  expect(prospect.getByLabelText('Trade Good 4')).toBeInTheDocument();
  expect(prospect.getByRole('img', { name: 'S Scouting Pattern' })).toBeInTheDocument();
  expect(prospect.queryByRole('button')).not.toBeInTheDocument();
  Object.entries({ Black: 0, Blue: 0, Purple: 1, Yellow: 0, Brick: 1 }).forEach(([label, count]) => {
    expect(within(screen.getByText(label).parentElement!).getByText(String(count))).toBeInTheDocument();
  });

  userEvent.click(draw);
  userEvent.click(within(screen.getByText('Purple').parentElement!).getByRole('button', { name: '+' }));
  expect(prospect.getByText('Trainer')).toBeInTheDocument();
  expect(prospect.queryByRole('button')).not.toBeInTheDocument();
  expect(within(screen.getByText('Purple').parentElement!).getByText('2')).toBeInTheDocument();
  expect(within(screen.getByText('Brick').parentElement!).getByText('1')).toBeInTheDocument();

  userEvent.click(clear);
  expect(screen.queryByRole('region', { name: 'Current Prospect' })).not.toBeInTheDocument();
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(screen.getByText('Completed Wall Guard Sections')).toBeInTheDocument();
  userEvent.click(draw);
  expect(screen.getByText('Forager')).toBeInTheDocument();
  expect(screen.queryByText('Trainer')).not.toBeInTheDocument();
});

test('choosing a new Prospect replaces the previous one without losing a retained Path', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  const draw = screen.getByRole('button', { name: 'Draw Player Card' });
  const clear = screen.getByRole('button', { name: 'Clear Player Cards' });
  userEvent.click(draw);
  userEvent.click(clear);
  userEvent.click(draw);
  userEvent.click(clear);
  userEvent.click(draw);
  userEvent.click(draw);

  userEvent.click(screen.getAllByRole('button', { name: 'As Resource' })[1]);
  userEvent.click(screen.getByRole('button', { name: 'As Path' }));
  expect(within(screen.getByRole('region', { name: 'Current Prospect' })).getByText('Trainer')).toBeInTheDocument();
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(within(screen.getByText('Blue').parentElement!).getByText('0')).toBeInTheDocument();
  expect(within(screen.getByText('Yellow').parentElement!).getByText('0')).toBeInTheDocument();

  userEvent.click(draw);
  userEvent.click(screen.getByRole('button', { name: 'As Resource' }));
  expect(screen.getAllByRole('region', { name: 'Current Prospect' })).toHaveLength(1);
  expect(within(screen.getByRole('region', { name: 'Current Prospect' })).getByText('Ranger')).toBeInTheDocument();
  expect(screen.queryByText('Trainer')).not.toBeInTheDocument();
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'As Path' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'As Resource' })).not.toBeInTheDocument();
});