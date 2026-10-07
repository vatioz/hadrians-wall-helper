# Hadrian's Wall Helper

A solo helper app for the board game Hadrian's Wall.

## Neutral Actions

Neutral cards appear in the Opponent Cards panel. Buy Goods spends one Resource
from the Brick counter; Scout spends one Soldier from the Black counter. Do not
also deduct those costs manually. Buttons show a cost of one and explain payment
in tooltips; actions are unavailable without the corresponding resource.

Every paid use adds a placement to that card and one Extra Invasion Draw. Repeated
uses accumulate, including across multiple cards (rulebook PDF pp. 13, 19, 22;
resource symbols on p. 24). The helper does not automatically draw Fate cards or
validate sheet prerequisites.

After resolving the invasion, clear the Neutral cards to remove their placements
and pending extra draws. Cleanup does not refund spent resources, remove Player
Paths, or replenish any deck. Clearing resource counters does not erase placements.

App regressions cover exact payments, repeated and cross-card totals, stable draw
instances, disabled-action tooltips, cleanup, and protection against batched
overspending. These tests do not depend on local rulebook files.

## Manual Cleanup

Cleanup buttons explain their effects on hover, keyboard focus, or touch-and-hold:

- **Clear Player Cards:** remove the displayed Player cards for the next Year;
	retain Paths and the remaining pile.
- **Clear Neutral Cards:** after invasion resolution, remove Neutral cards,
	placements and extra draws without refunding payments.
- **Clear Invasion:** remove revealed Fate cards and their attack totals.
- **Zero Resources:** zero available counters without removing cards, placements
	or Paths.

None of these actions reshuffles or replenishes a deck, starts a new game, or
advances the Year. The next draw continues from the remaining pile; drawing from
an exhausted pile still automatically reshuffles that source deck.

## Getting Started

### Prerequisites

- Node.js 24 LTS (the development container includes it)
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/vatioz/hadrians-wall-helper.git
cd hadrians-wall-helper
npm install
```

### Development

Start the development server:

```bash
npm start
```

Open [http://localhost:3000/hadrians-wall-helper/](http://localhost:3000/hadrians-wall-helper/).

The page will automatically reload when you make changes.

### Testing

Run the automated tests once without watch mode, locally or in CI:

```bash
npm test
npm run typecheck
npm run lint
```

Place tests next to their components or exported reference data using the
`*.test.tsx` or `*.test.ts` naming convention.
Use React Testing Library's `render` and `screen`, preferring role and accessible
name queries for controls and visible text queries for content. Testing Library DOM matchers
such as `toBeInTheDocument` are loaded automatically by `src/setupTests.ts`.

`src/App.test.tsx` renders the real app without mocking its components and covers
card draws, resources, and independent deck controls. Vitest uses jsdom and the
setup configured in `vite.config.ts`. Use `npm run test:watch` during development.

See the [rule-backed coverage checklist](docs/testing.md) for issue #12's
Phase 1 checks, source pages, and unresolved reference gaps.

### Production Build

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `build/` folder, ready for deployment.
Vite preserves the `/hadrians-wall-helper/` GitHub Pages base path. Preview the
production output with `npm run preview` and open
[http://localhost:4173/hadrians-wall-helper/](http://localhost:4173/hadrians-wall-helper/).

## Tech Stack

- React 19
- TypeScript
- Material-UI v5
- Styled Components
- Vite, Vitest, and ESLint
