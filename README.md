# Hadrian's Wall Helper

A solo helper app for the board game Hadrian's Wall.

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
For user interactions, create a `userEvent.setup()` session inside each test and
await its actions. Keep direct `fireEvent` calls for intentional batched-event
regressions that must exercise multiple updates in the same `act` scope.

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

### Deployment

The `Validate and Deploy Pages` workflow installs dependencies, runs tests and
lint, checks high-severity audit findings, and builds the app. Pull requests only
validate; pushes to `main` publish `build/` to GitHub Pages.

Before the first Actions deployment, set **Settings > Pages > Build and deployment >
Source** to **GitHub Actions**. The site remains at
[https://vatioz.github.io/hadrians-wall-helper/](https://vatioz.github.io/hadrians-wall-helper/).
Once the workflow is on `main`, use **Actions > Validate and Deploy Pages > Run workflow**
with the `main` branch to retry a deployment manually. No local deployment token
or `gh-pages` CLI is needed.

## Tech Stack

- React 19
- TypeScript
- Material UI v9
- Styled Components
- Vite, Vitest, and ESLint
