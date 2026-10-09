import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';
import playerCards from './settings/playerCards';

afterEach(() => {
  vi.restoreAllMocks();
});

test('retained Path groups use responsive widths and keep complete scoring thresholds together', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  const draw = screen.getByRole('button', { name: 'Draw Player Card' });
  const names = ['Engineer', 'Planner', 'Trainer', 'Vanguard', 'Ranger', 'Forager'];

  names.forEach((name, index) => {
    fireEvent.click(draw);
    fireEvent.click(screen.getByRole('button', { name: 'As Path' }));
    const group = screen.getByText(name).parentElement!;
    expect(group).toHaveClass('MuiGrid-grid-xs-12', 'MuiGrid-grid-sm-6', 'MuiGrid-grid-md-2');
    expect(group.parentElement!.children).toHaveLength(index + 1);
    names.slice(0, index + 1).forEach((retainedName) => {
      const retained = within(screen.getByText(retainedName).parentElement!);
      const card = playerCards.find((entry) => entry.name === retainedName)!;
      expect(retained.getByText(card.objective)).toBeInTheDocument();
      Object.entries(card.score).forEach(([threshold, points]) => {
        expect(retained.getByText(`${threshold} : ${points}VP`)).toHaveStyle({ whiteSpace: 'nowrap' });
      });
    });
  });
});

test.each([
  { name: 'Pontiff', draws: 7, color: 'rgb(128, 0, 128)', resource: 'Purple' },
  { name: 'Architect', draws: 11, color: 'rgb(128, 128, 128)', resource: 'Brick' },
])('$name repeated reward swatches stay mounted in Player and Prospect views without key warnings', async ({ name, draws, color, resource }) => {
  const user = userEvent.setup();
  const random = vi.spyOn(Math, 'random').mockReturnValue(0);
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<App />);
  const draw = screen.getByRole('button', { name: 'Draw Player Card' });
  const clear = screen.getByRole('button', { name: 'Clear Player Cards' });
  for (let drawCount = 1; drawCount < draws; drawCount += 1) {
    fireEvent.click(draw);
    fireEvent.click(clear);
  }
  errors.mockClear();
  await user.click(draw);
  const card = screen.getByText(name).closest('section')!;
  const swatches = (container: HTMLElement) => Array.from(container.querySelectorAll('div'))
    .filter((element) => getComputedStyle(element).backgroundColor === color);
  const expectMountedSwatches = (container: HTMLElement, original: HTMLElement[]) => {
    const current = swatches(container);
    expect(current).toHaveLength(original.length);
    current.forEach((swatch, index) => expect(swatch).toBe(original[index]));
  };
  const playerSwatches = swatches(card);
  expect(playerSwatches).toHaveLength(2);
  expect(errors).not.toHaveBeenCalled();
  const chooseProspect = within(card).getByRole('button', { name: 'As Resource' });

  random.mockReturnValue(0.25);
  await user.click(draw);
  expectMountedSwatches(card, playerSwatches);
  random.mockReturnValue(0.75);
  await user.click(within(screen.getByText('Black').parentElement!).getByRole('button', { name: '+' }));
  expectMountedSwatches(card, playerSwatches);

  await user.click(chooseProspect);
  const prospect = screen.getByRole('region', { name: 'Current Prospect' });
  const prospectSwatches = swatches(prospect);
  expect(prospectSwatches).toHaveLength(2);
  expect(within(prospect).getByText(name)).toBeInTheDocument();
  expect(within(screen.getByText(resource).parentElement!).getByText('2')).toBeInTheDocument();
  random.mockReturnValue(0.4);
  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  expectMountedSwatches(prospect, prospectSwatches);
  random.mockReturnValue(0.6);
  await user.click(within(screen.getByText(resource).parentElement!).getByRole('button', { name: '+' }));
  expectMountedSwatches(prospect, prospectSwatches);
  expect(within(screen.getByText(resource).parentElement!).getByText('3')).toBeInTheDocument();
  expect(errors).not.toHaveBeenCalled();
});

test('retained Paths preserve mounted scoring content across deck cycles and respect the six-Path cap', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<App />);
  const draw = screen.getByRole('button', { name: 'Draw Player Card' });
  const clear = screen.getByRole('button', { name: 'Clear Player Cards' });
  await user.click(draw);
  await user.click(screen.getByRole('button', { name: 'As Path' }));
  const originalName = screen.getByText('Engineer');
  const originalScores = within(originalName.parentElement!).getAllByText(/VP$/);
  const expectOriginalScores = () => {
    const current = within(originalName.parentElement!).getAllByText(/VP$/);
    expect(current).toHaveLength(originalScores.length);
    current.forEach((score, index) => expect(score).toBe(originalScores[index]));
  };
  expect(errors).not.toHaveBeenCalled();

  for (let remaining = 11; remaining > 0; remaining -= 1) {
    fireEvent.click(draw);
    fireEvent.click(clear);
  }
  await user.click(draw);
  errors.mockClear();
  await user.click(screen.getByRole('button', { name: 'As Path' }));
  const names = screen.getAllByText('Engineer');
  expect(names).toHaveLength(2);
  expect(names[0]).toBe(originalName);
  expectOriginalScores();
  expect(errors).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button', { name: 'Draw Fate Card' }));
  await user.click(within(screen.getByText('Black').parentElement!).getByRole('button', { name: '+' }));
  expect(screen.getAllByText('Engineer')).toHaveLength(2);
  names.forEach((name, index) => expect(screen.getAllByText('Engineer')[index]).toBe(name));
  expectOriginalScores();
  await user.click(screen.getByRole('button', { name: 'Zero Resources' }));

  for (let paths = 2; paths < 6; paths += 1) {
    fireEvent.click(draw);
    fireEvent.click(screen.getByRole('button', { name: 'As Path' }));
  }
  await user.click(draw);
  const seventhPath = screen.getByRole('button', { name: 'As Path' });
  expect(seventhPath).toBeDisabled();
  fireEvent.click(seventhPath);
  expect(seventhPath).toBeInTheDocument();
  expect(screen.getAllByText('Engineer')).toHaveLength(2);
  names.forEach((name, index) => expect(screen.getAllByText('Engineer')[index]).toBe(name));
  ['Black', 'Blue', 'Purple', 'Yellow', 'Brick'].forEach((label) => {
    expect(within(screen.getByText(label).parentElement!).getByText('0')).toBeInTheDocument();
  });
});

test('the chosen Prospect retains its information and grants its reward only once (PDF pp. 4-5)', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  const draw = screen.getByRole('button', { name: 'Draw Player Card' });
  const clear = screen.getByRole('button', { name: 'Clear Player Cards' });
  await user.click(draw);
  await user.click(clear);
  await user.click(draw);
  await user.click(clear);
  await user.click(draw);
  await user.click(draw);

  await user.click(screen.getAllByRole('button', { name: 'As Path' })[0]);
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(screen.getByText('Completed Wall Guard Sections')).toBeInTheDocument();
  expect(screen.getByText('3 : 3VP')).toBeInTheDocument();
  ['Black', 'Blue', 'Purple', 'Yellow', 'Brick'].forEach((label) => {
    expect(within(screen.getByText(label).parentElement!).getByText('0')).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: 'As Resource' }));

  const prospect = within(screen.getByRole('region', { name: 'Current Prospect' }));
  expect(prospect.getByText('Trainer')).toBeInTheDocument();
  expect(prospect.getByLabelText('Trade Good 4')).toBeInTheDocument();
  expect(prospect.getByRole('img', { name: 'S Scouting Pattern' })).toBeInTheDocument();
  expect(prospect.queryByRole('button')).not.toBeInTheDocument();
  Object.entries({ Black: 0, Blue: 0, Purple: 1, Yellow: 0, Brick: 1 }).forEach(([label, count]) => {
    expect(within(screen.getByText(label).parentElement!).getByText(String(count))).toBeInTheDocument();
  });

  await user.click(draw);
  await user.click(within(screen.getByText('Purple').parentElement!).getByRole('button', { name: '+' }));
  expect(prospect.getByText('Trainer')).toBeInTheDocument();
  expect(prospect.queryByRole('button')).not.toBeInTheDocument();
  expect(within(screen.getByText('Purple').parentElement!).getByText('2')).toBeInTheDocument();
  expect(within(screen.getByText('Brick').parentElement!).getByText('1')).toBeInTheDocument();

  await user.click(clear);
  expect(screen.queryByRole('region', { name: 'Current Prospect' })).not.toBeInTheDocument();
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(screen.getByText('Completed Wall Guard Sections')).toBeInTheDocument();
  await user.click(draw);
  expect(screen.getByText('Forager')).toBeInTheDocument();
  expect(screen.queryByText('Trainer')).not.toBeInTheDocument();
});

test('choosing a new Prospect replaces the previous one without losing a retained Path', async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<App />);
  const draw = screen.getByRole('button', { name: 'Draw Player Card' });
  const clear = screen.getByRole('button', { name: 'Clear Player Cards' });
  await user.click(draw);
  await user.click(clear);
  await user.click(draw);
  await user.click(clear);
  await user.click(draw);
  await user.click(draw);

  await user.click(screen.getAllByRole('button', { name: 'As Resource' })[1]);
  await user.click(screen.getByRole('button', { name: 'As Path' }));
  expect(within(screen.getByRole('region', { name: 'Current Prospect' })).getByText('Trainer')).toBeInTheDocument();
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(within(screen.getByText('Blue').parentElement!).getByText('0')).toBeInTheDocument();
  expect(within(screen.getByText('Yellow').parentElement!).getByText('0')).toBeInTheDocument();

  await user.click(draw);
  await user.click(screen.getByRole('button', { name: 'As Resource' }));
  expect(screen.getAllByRole('region', { name: 'Current Prospect' })).toHaveLength(1);
  expect(within(screen.getByRole('region', { name: 'Current Prospect' })).getByText('Ranger')).toBeInTheDocument();
  expect(screen.queryByText('Trainer')).not.toBeInTheDocument();
  expect(screen.getByText('Vanguard')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'As Path' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'As Resource' })).not.toBeInTheDocument();
});