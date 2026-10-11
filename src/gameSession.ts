import { DeckState, DrawnCard } from './hooks/useDeck';
import { FateCard } from './settings/fateCards.model';
import fateCards from './settings/fateCards';
import opponentCards from './settings/opponentCards';
import playerCards from './settings/playerCards';
import { NeutralCardUsage, PlayerCard } from './settings/playerCards.model';

export type Resource = 'black' | 'blue' | 'purple' | 'yellow' | 'brick';
export type ResourceAmount = Record<Resource, number>;

export interface ResourceState {
  amount: ResourceAmount;
  neutralUses: Record<number, NeutralCardUsage>;
}

export interface GameSession {
  resources: ResourceState;
  paths: DrawnCard<PlayerCard>[];
  prospect: DrawnCard<PlayerCard> | null;
  fate: DeckState<FateCard>;
  player: DeckState<PlayerCard>;
  neutral: DeckState<PlayerCard>;
}

export const SESSION_STORAGE_KEY = 'hadrians-wall-helper:session';

// Bump when the stored shape or the card catalogs' order changes: cards are stored by index.
const SESSION_VERSION = 1;
const MAX_PATHS = 6;
const RESOURCES: Resource[] = ['black', 'blue', 'purple', 'yellow', 'brick'];

interface StoredDrawn {
  id: number;
  card: number;
}

interface StoredDeck {
  remaining: number[];
  drawn: StoredDrawn[];
  nextId: number;
}

interface StoredSession {
  version: number;
  resources: { amount: ResourceAmount; neutralUses: Record<number, NeutralCardUsage> };
  paths: StoredDrawn[];
  prospect: StoredDrawn | null;
  fate: StoredDeck;
  player: StoredDeck;
  neutral: StoredDeck;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isCount = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;

const isCatalogIndex = (value: unknown, catalog: readonly unknown[]): value is number =>
  isCount(value) && value < catalog.length;

const hasUniqueIds = (ids: number[]) => new Set(ids).size === ids.length;

const toStoredDrawn = <Card>(entry: DrawnCard<Card>, catalog: readonly Card[]): StoredDrawn => ({
  id: entry.id,
  card: catalog.indexOf(entry.card),
});

const toStoredDeck = <Card>(deck: DeckState<Card>, catalog: readonly Card[]): StoredDeck => ({
  remaining: deck.remaining.map((card) => catalog.indexOf(card)),
  drawn: deck.drawn.map((entry) => toStoredDrawn(entry, catalog)),
  nextId: deck.nextId,
});

const parseDrawn = <Card>(value: unknown, catalog: readonly Card[]): DrawnCard<Card> | null => {
  if (!isRecord(value) || !isCount(value.id) || !isCatalogIndex(value.card, catalog)) {
    return null;
  }
  return { id: value.id, card: catalog[value.card] };
};

const parseDrawnList = <Card>(value: unknown, catalog: readonly Card[]): DrawnCard<Card>[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }
  const entries = value.map((item) => parseDrawn(item, catalog));
  return entries.every((entry): entry is DrawnCard<Card> => entry !== null) ? entries : null;
};

const parseDeck = <Card>(value: unknown, catalog: readonly Card[]): DeckState<Card> | null => {
  if (!isRecord(value) || !isCount(value.nextId) || !Array.isArray(value.remaining)) {
    return null;
  }
  const remainingIndices = value.remaining;
  // A pile holds each card at most once; drawn entries may repeat a card from an earlier cycle.
  if (!remainingIndices.every((index) => isCatalogIndex(index, catalog)) || !hasUniqueIds(remainingIndices)) {
    return null;
  }
  const drawn = parseDrawnList(value.drawn, catalog);
  const { nextId } = value;
  if (!drawn || !hasUniqueIds(drawn.map((entry) => entry.id)) || drawn.some((entry) => entry.id >= nextId)) {
    return null;
  }
  return {
    remaining: remainingIndices.map((index) => catalog[index]),
    drawn,
    nextId,
  };
};

const parseResources = (value: unknown, neutralIds: number[]): ResourceState | null => {
  if (!isRecord(value) || !isRecord(value.amount) || !isRecord(value.neutralUses)) {
    return null;
  }
  const amount = {} as ResourceAmount;
  for (const resource of RESOURCES) {
    const count = value.amount[resource];
    if (!isCount(count)) {
      return null;
    }
    amount[resource] = count;
  }

  const neutralUses: Record<number, NeutralCardUsage> = {};
  for (const [key, usage] of Object.entries(value.neutralUses)) {
    const id = Number(key);
    if (
      String(id) !== key ||
      !neutralIds.includes(id) ||
      !isRecord(usage) ||
      !isCount(usage.resources) ||
      !isCount(usage.soldiers)
    ) {
      return null;
    }
    neutralUses[id] = { resources: usage.resources, soldiers: usage.soldiers };
  }

  return { amount, neutralUses };
};

export function parseGameSession(raw: unknown): GameSession | null {
  if (!isRecord(raw) || raw.version !== SESSION_VERSION) {
    return null;
  }

  const fate = parseDeck(raw.fate, fateCards);
  const player = parseDeck(raw.player, playerCards);
  const neutral = parseDeck(raw.neutral, opponentCards);
  const paths = parseDrawnList(raw.paths, playerCards);
  const prospect = raw.prospect === null ? null : parseDrawn(raw.prospect, playerCards);
  if (!fate || !player || !neutral || !paths || (raw.prospect !== null && !prospect) || paths.length > MAX_PATHS) {
    return null;
  }

  // Paths and Prospect were drawn from the Player deck, so their IDs must be unique and allocated there.
  const playerIds = [...paths, ...(prospect ? [prospect] : []), ...player.drawn].map((entry) => entry.id);
  if (!hasUniqueIds(playerIds) || playerIds.some((id) => id >= player.nextId)) {
    return null;
  }

  const resources = parseResources(raw.resources, neutral.drawn.map((entry) => entry.id));
  if (!resources) {
    return null;
  }

  return { resources, paths, prospect, fate, player, neutral };
}

export function serializeGameSession(session: GameSession): StoredSession {
  return {
    version: SESSION_VERSION,
    resources: session.resources,
    paths: session.paths.map((entry) => toStoredDrawn(entry, playerCards)),
    prospect: session.prospect ? toStoredDrawn(session.prospect, playerCards) : null,
    fate: toStoredDeck(session.fate, fateCards),
    player: toStoredDeck(session.player, playerCards),
    neutral: toStoredDeck(session.neutral, opponentCards),
  };
}

const getStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function loadGameSession(): GameSession | null {
  try {
    const raw = getStorage()?.getItem(SESSION_STORAGE_KEY);
    return raw ? parseGameSession(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveGameSession(session: GameSession): void {
  try {
    getStorage()?.setItem(SESSION_STORAGE_KEY, JSON.stringify(serializeGameSession(session)));
  } catch {
    // Storage is unavailable or full; the session continues in memory.
  }
}
