/**
 * THROWAWAY PROTOTYPE — DO NOT PROMOTE DIRECTLY TO PRODUCTION
 *
 * Plan: Four radically different mobile/tablet layout variants (plus 'current' baseline)
 * on the existing `/` route, switchable via `?variant=A|B|C|D|current` and a floating bottom bar.
 */
import { DrawnCard } from '../hooks/useDeck';
import { ResourceAmount } from '../gameSession';
import { FateCard } from '../settings/fateCards.model';
import { NeutralCardUsage, PlayerCard } from '../settings/playerCards.model';
import { Round } from '../settings/rounds.model';

export type PrototypeVariantKey = 'A' | 'B' | 'C' | 'D' | 'current';

export interface PrototypeVariantMeta {
  key: PrototypeVariantKey;
  name: string;
  tagline: string;
}

export const PROTOTYPE_VARIANTS: PrototypeVariantMeta[] = [
  {
    key: 'A',
    name: 'Bottom-Tab Phase Workspace',
    tagline: 'Sticky resource bar + single active tab on phones; zero vertical page scroll between decks',
  },
  {
    key: 'B',
    name: 'Year-Step Guided Flow',
    tagline: 'Chronological solo turn stepper (Year Setup -> Player -> Neutral -> Invasion -> Cleanup)',
  },
  {
    key: 'C',
    name: 'Tablet Split-Pane War Room',
    tagline: '2-column asymmetric split on tablet + horizontal snap-scroll card rails on mobile',
  },
  {
    key: 'D',
    name: 'Compact Accordion + Bottom Sheet',
    tagline: 'Dense single-screen dashboard with collapsible headers & swipe-style resource tray',
  },
  {
    key: 'current',
    name: 'Current Baseline',
    tagline: 'Existing 3-column vertical stack for direct comparison',
  },
];

export interface PrototypeAppProps {
  rounds: Round[];
  resourceAmount: ResourceAmount;
  neutralUses: Record<number, NeutralCardUsage>;
  extraInvasionDraws: number;
  pictDirectionCount: { left: number; center: number; right: number };
  objectiveCards: DrawnCard<PlayerCard>[];
  prospect: DrawnCard<PlayerCard> | null;
  playerDrawn: DrawnCard<PlayerCard>[];
  playerRemaining: number;
  playerTotal: number;
  canDrawPlayer: boolean;
  opponentDrawn: DrawnCard<PlayerCard>[];
  opponentRemaining: number;
  opponentTotal: number;
  canDrawOpponent: boolean;
  fateDrawn: DrawnCard<FateCard>[];
  fateRemaining: number;
  fateTotal: number;
  canDrawFate: boolean;
  onOpenNewGame: () => void;
  onLoadDemoMidYear: () => void;
  onResetResources: () => void;
  onChangeResource: (key: string, amount: number) => void;
  onDrawPlayer: () => void;
  onClearPlayer: () => void;
  onAddObjective: (entry: DrawnCard<PlayerCard>) => void;
  onAddResourceFromPlayer: (entry: DrawnCard<PlayerCard>) => void;
  onDrawOpponent: () => void;
  onClearOpponent: () => void;
  onUseNeutral: (id: number, resource: 'brick' | 'black') => void;
  onDrawFate: () => void;
  onClearFate: () => void;
  onSortFate: () => void;
  onAddResourceFromFate: (entry: DrawnCard<FateCard>) => void;
  onDiscardFate: (id: number) => void;
}
