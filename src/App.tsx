import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Stack, ThemeProvider, Tooltip } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useEffect, useState } from 'react';

import {
  AppContainer,
  AppGradientWrapper,
  AppHeaderContainer,
  AppPrimaryButton,
  AppPrimaryText,
  FateCardSection,
  ObjectiveExplainText,
  ObjectiveScoreText,
  PlayerCardSection,
  RoundPrimaryText,
  RoundReferenceGrid,
  RoundSecondaryText,
  RoundTrackContainer,
} from './App.styled';
import FateCardContainer from './components/fateCard';
import fateCards from './settings/fateCards';
import rounds from './settings/rounds';
import { FateCard } from './settings/fateCards.model';
import { PlayerCard } from './settings/playerCards.model';
import playerCards from './settings/playerCards';
import opponentCards from './settings/opponentCards';
import PlayerCardContainer from './components/playerCard';
import ResourceCounterPanel from './components/resourceCounterPanel';
import OpponentCardPanel from './components/OpponentCardPanel';
import { DrawnCard, useDeck } from './hooks/useDeck';
import { muiTheme } from './theme';
import { loadGameSession, ResourceState, saveGameSession } from './gameSession';
import { PROTOTYPE_VARIANTS, PrototypeAppProps, PrototypeVariantKey } from './prototype/prototype.types';
import { PrototypeSwitcher } from './prototype/PrototypeSwitcher';
import { VariantABottomTabWorkspace } from './prototype/VariantABottomTabWorkspace';
import { VariantBYearStepFlow } from './prototype/VariantBYearStepFlow';
import { VariantCTabletSplitRails } from './prototype/VariantCTabletSplitRails';
import { VariantDCompactAccordionSheet } from './prototype/VariantDCompactAccordionSheet';

// PROTOTYPE PLAN: Four mobile/tablet layout variants (A, B, C, D) + 'current' baseline
// on the existing '/' route, switchable via `?variant=` and the floating bottom bar.
const getInitialVariant = (): PrototypeVariantKey => {
  const raw = new URLSearchParams(window.location.search).get('variant');
  if (raw && PROTOTYPE_VARIANTS.some((v) => v.key === raw)) {
    return raw as PrototypeVariantKey;
  }
  return 'A';
};

const createEmptyResourceState = (): ResourceState => ({
  amount: { black: 0, blue: 0, purple: 0, yellow: 0, brick: 0 },
  neutralUses: {},
});

const App = () => {
  const [initialSession] = useState(loadGameSession);
  const [variant, setVariant] = useState<PrototypeVariantKey>(getInitialVariant);
  const fateDeck = useDeck(fateCards, Math.random, initialSession?.fate, { reshuffleWhenEmpty: true });
  const playerDeck = useDeck(playerCards, Math.random, initialSession?.player);
  const opponentDeck = useDeck(opponentCards, Math.random, initialSession?.neutral);
  const [objectiveCards, setObjectiveCards] = useState<DrawnCard<PlayerCard>[]>(initialSession?.paths ?? []);
  const [prospect, setProspect] = useState<DrawnCard<PlayerCard> | null>(initialSession?.prospect ?? null);
  const [resourceState, setResourceState] = useState<ResourceState>(
    () => initialSession?.resources ?? createEmptyResourceState(),
  );
  const [newGameOpen, setNewGameOpen] = useState(false);
  const resourceAmount = resourceState.amount;

  const selectVariant = (next: PrototypeVariantKey) => {
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', next);
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    saveGameSession({
      resources: resourceState,
      paths: objectiveCards,
      prospect,
      fate: fateDeck.state,
      player: playerDeck.state,
      neutral: opponentDeck.state,
    });
  }, [resourceState, objectiveCards, prospect, fateDeck.state, playerDeck.state, opponentDeck.state]);

  const startNewGame = () => {
    setResourceState(createEmptyResourceState());
    setObjectiveCards([]);
    setProspect(null);
    fateDeck.reset();
    playerDeck.reset();
    opponentDeck.reset();
    setNewGameOpen(false);
  };

  const pictDirectionCount = fateDeck.drawnCards.reduce((counts, { card }) => ({
    ...counts,
    [card.picts_direction]: counts[card.picts_direction] + 1,
  }), { left: 0, center: 0, right: 0 });

  const addObjectiveCard = (entry: DrawnCard<PlayerCard>) => {
    if (objectiveCards.length < 6) {
      setObjectiveCards([...objectiveCards, entry]);
      playerDeck.discard(entry.id);
    }
  };

  const addResourceFromPlayerCard = (entry: DrawnCard<PlayerCard>) => {
    setResourceState((current) => {
      const updated = { ...current.amount };
      entry.card.resources.forEach((resource: 'black' | 'blue' | 'purple' | 'yellow' | 'brick') => {
        updated[resource] = updated[resource] + 1;
      });
      return { ...current, amount: updated };
    });
    setProspect(entry);
    playerDeck.discard(entry.id);
  };

  const clearPlayerCards = () => {
    setProspect(null);
    playerDeck.clear();
  };

  const addResourceFromFateCard = (entry: DrawnCard<FateCard>) => {
    setResourceState((current) => {
      const updated = { ...current.amount };
      entry.card.resource.forEach((resource: 'black' | 'blue' | 'purple' | 'yellow' | 'brick') => {
        updated[resource] = updated[resource] + 1;
      });
      return { ...current, amount: updated };
    });
    fateDeck.discard(entry.id);
  };

  const useNeutralCard = (id: number, resource: 'brick' | 'black') => {
    if (!opponentDeck.drawnCards.some((entry) => entry.id === id)) {
      return;
    }
    setResourceState((current) => {
      if (current.amount[resource] < 1) {
        return current;
      }
      const usage = current.neutralUses[id] || { resources: 0, soldiers: 0 };
      const placement = resource === 'brick' ? 'resources' : 'soldiers';
      return {
        amount: { ...current.amount, [resource]: current.amount[resource] - 1 },
        neutralUses: {
          ...current.neutralUses,
          [id]: { ...usage, [placement]: usage[placement] + 1 },
        },
      };
    });
  };

  const clearNeutralCards = () => {
    setResourceState((current) => ({ ...current, neutralUses: {} }));
    opponentDeck.clear();
  };

  const resetResourceAmount = () => {
    setResourceState((current) => ({
      ...current,
      amount: { black: 0, blue: 0, purple: 0, yellow: 0, brick: 0 },
    }));
  };

  const sortByArrow = () => {
    const directions = ['left', 'center', 'right'];
    fateDeck.sort((left, right) => directions.indexOf(left.picts_direction) - directions.indexOf(right.picts_direction));
  };

  const changeResourceAmountByKey = (key: string, amount: number) => {
    setResourceState((current) => ({
      ...current,
      amount: { ...current.amount, [key]: amount },
    }));
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const extraInvasionDraws = opponentDeck.drawnCards.reduce((total, { id }) => {
    const usage = resourceState.neutralUses[id];
    return total + (usage ? usage.resources + usage.soldiers : 0);
  }, 0);

  const loadDemoMidYear = () => {
    setObjectiveCards([
      { id: 900, card: playerCards[1] },
      { id: 901, card: playerCards[2] },
      { id: 902, card: playerCards[3] },
    ]);
    setProspect({ id: 903, card: playerCards[0] });
    setResourceState({
      amount: { black: 3, blue: 2, purple: 2, yellow: 4, brick: 3 },
      neutralUses: {},
    });
    if (playerDeck.drawnCards.length === 0) {
      playerDeck.draw();
      playerDeck.draw();
    }
    if (opponentDeck.drawnCards.length === 0) {
      opponentDeck.draw();
      opponentDeck.draw();
    }
    if (fateDeck.drawnCards.length === 0) {
      fateDeck.draw();
      fateDeck.draw();
      fateDeck.draw();
    }
  };

  const prototypeProps: PrototypeAppProps = {
    rounds,
    resourceAmount,
    neutralUses: resourceState.neutralUses,
    extraInvasionDraws,
    pictDirectionCount,
    objectiveCards,
    prospect,
    playerDrawn: playerDeck.drawnCards,
    playerRemaining: playerDeck.remainingCount,
    playerTotal: playerDeck.totalCount,
    canDrawPlayer: playerDeck.canDraw,
    opponentDrawn: opponentDeck.drawnCards,
    opponentRemaining: opponentDeck.remainingCount,
    opponentTotal: opponentDeck.totalCount,
    canDrawOpponent: opponentDeck.canDraw,
    fateDrawn: fateDeck.drawnCards,
    fateRemaining: fateDeck.remainingCount,
    fateTotal: fateDeck.totalCount,
    canDrawFate: fateDeck.canDraw,
    onOpenNewGame: () => setNewGameOpen(true),
    onLoadDemoMidYear: loadDemoMidYear,
    onResetResources: resetResourceAmount,
    onChangeResource: changeResourceAmountByKey,
    onDrawPlayer: playerDeck.draw,
    onClearPlayer: clearPlayerCards,
    onAddObjective: addObjectiveCard,
    onAddResourceFromPlayer: addResourceFromPlayerCard,
    onDrawOpponent: opponentDeck.draw,
    onClearOpponent: clearNeutralCards,
    onUseNeutral: useNeutralCard,
    onDrawFate: fateDeck.draw,
    onClearFate: fateDeck.clear,
    onSortFate: sortByArrow,
    onAddResourceFromFate: addResourceFromFateCard,
    onDiscardFate: fateDeck.discard,
  };

  const stateSummary = `Paths ${objectiveCards.length}/6 · Player ${playerDeck.drawnCards.length} · Neutral ${opponentDeck.drawnCards.length} (+${extraInvasionDraws}) · Fate ${fateDeck.drawnCards.length}`;

  return (
    <StyledThemeProvider theme={muiTheme}>
    <ThemeProvider theme={muiTheme}>
      <Dialog open={newGameOpen} onClose={() => setNewGameOpen(false)} aria-labelledby='new-game-title'>
        <DialogTitle id='new-game-title'>Start a new game?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This clears resources, Paths, the Prospect, Neutral placements, and all displayed cards, then reshuffles all three decks.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewGameOpen(false)}>Cancel</Button>
          <Button color='error' onClick={startNewGame}>Start new game</Button>
        </DialogActions>
      </Dialog>

      {variant === 'A' && <VariantABottomTabWorkspace {...prototypeProps} />}
      {variant === 'B' && <VariantBYearStepFlow {...prototypeProps} />}
      {variant === 'C' && <VariantCTabletSplitRails {...prototypeProps} />}
      {variant === 'D' && <VariantDCompactAccordionSheet {...prototypeProps} />}
      {variant === 'current' && (
      <AppGradientWrapper>
        <AppContainer>
          <AppHeaderContainer>
            <AppPrimaryText>Hadrian's Wall Solo Helper</AppPrimaryText>
            <AppPrimaryButton onClick={() => setNewGameOpen(true)}>
              New Game
            </AppPrimaryButton>
          </AppHeaderContainer>
          <RoundTrackContainer>
            <RoundReferenceGrid role='region' aria-label='Round reference'>
              {rounds &&
                rounds.map((round) => (
                  <Stack
                    role='group'
                    aria-label={`Round ${round.round}`}
                    sx={{ alignItems: 'center', minWidth: 0 }}
                    key={`${round.round}-round`}
                  >
                    <RoundPrimaryText>Round {round.round}</RoundPrimaryText>
                    <Stack sx={{ width: '100%' }}>
                      <Grid
                        container
                        direction='row'
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.easy}>
                          Easy
                        </RoundSecondaryText>
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.easy}>
                          {round.easy}
                        </RoundSecondaryText>
                      </Grid>
                      <Grid
                        container
                        direction='row'
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.medium}>
                          Medium
                        </RoundSecondaryText>
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.medium}>
                          {round.medium}
                        </RoundSecondaryText>
                      </Grid>
                      <Grid
                        container
                        direction='row'
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.hard}>
                          Hard
                        </RoundSecondaryText>
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.hard}>
                          {round.hard}
                        </RoundSecondaryText>
                      </Grid>
                      <Grid
                        container
                        direction='row'
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.valour}>
                          Valour
                        </RoundSecondaryText>
                        <RoundSecondaryText color={muiTheme.palette.app.difficulty.valour}>
                          {round.valour}
                        </RoundSecondaryText>
                      </Grid>
                    </Stack>
                  </Stack>
                ))}
            </RoundReferenceGrid>
            <Divider />
            <Grid container spacing={3}>
              {objectiveCards &&
                objectiveCards.map(({ id, card }) => (
                  <Grid
                    key={id}
                    container
                    sx={{ flexDirection: 'column', alignItems: 'center' }}
                    size={{ xs: 12, sm: 6, md: 2 }}
                    spacing={0}
                  >
                    <RoundPrimaryText>{card.name}</RoundPrimaryText>
                    <ObjectiveExplainText
                      fontWeight={300}
                      fontSize={'0.8em'}
                      color={muiTheme.palette.app.ink}
                    >
                      {card.objective}
                    </ObjectiveExplainText>
                    <Grid
                      container
                      direction='row'
                      sx={{ justifyContent: 'space-between', width: '100%' }}
                    >
                      {Object.entries(card.score).map(([key, val]) => (
                        <ObjectiveScoreText key={key} fontWeight={500} fontSize={'0.8em'}>
                          {key} : {val}VP
                        </ObjectiveScoreText>
                      ))}
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </RoundTrackContainer>
          <Grid container spacing={2}>
            {/** Grid for Resource Counter and AI Card */}
            <Grid
              size={{ xs: 12, md: 4 }}
            >
              <ResourceCounterPanel
                resourceAmount={resourceAmount}
                resetResourceAmount={resetResourceAmount}
                changeResourceAmountByKey={changeResourceAmountByKey}
              />
              <OpponentCardPanel
                opponentCards={opponentDeck.drawnCards}
                clearOpponentCards={clearNeutralCards}
                randomOpponentCard={opponentDeck.draw}
                deckRemaining={opponentDeck.remainingCount}
                canDrawOpponentCard={opponentDeck.canDraw}
                deckTotal={opponentDeck.totalCount}
                neutralUses={resourceState.neutralUses}
                canBuyGoods={resourceAmount.brick > 0}
                canScout={resourceAmount.black > 0}
                onNeutralUse={useNeutralCard}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FateCardSection key={`form-card-fate-card`}>
                <Grid
                  container
                  direction='row'
                  sx={{ justifyContent: 'space-between' }}
                >
                  <AppPrimaryText>Fate Cards</AppPrimaryText>
                  <Tooltip describeChild disableInteractive title='Remove revealed Fate cards and attack totals after resolving the invasion. Do not reshuffle the deck.'>
                    <AppPrimaryButton onClick={fateDeck.clear}>
                      Clear Invasion
                    </AppPrimaryButton>
                  </Tooltip>
                </Grid>
                <Grid
                  container
                  direction='row'
                  sx={{ justifyContent: 'space-between' }}
                >
                  {Object.entries(pictDirectionCount).map(([key, val]) => (
                    <RoundSecondaryText color={muiTheme.palette.app.ink} key={key}>
                      {capitalizeFirstLetter(key)} : {val}
                    </RoundSecondaryText>
                  ))}
                </Grid>
                <AppPrimaryButton onClick={fateDeck.draw} disabled={!fateDeck.canDraw}>
                  Draw Fate Card
                </AppPrimaryButton>
                <div>Deck: {fateDeck.remainingCount}/{fateDeck.totalCount}</div>
                <AppPrimaryButton onClick={sortByArrow}>
                  Sort By Arrow
                </AppPrimaryButton>
                {fateDeck.drawnCards.map((entry) => (
                    <FateCardContainer
                      key={`fate-${entry.id}`}
                      card={entry.card}
                      addResourceFromFateCard={() => addResourceFromFateCard(entry)}
                      removePickedFateCards={() => fateDeck.discard(entry.id)}
                    />
                  ))}
              </FateCardSection>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <PlayerCardSection key={`form-card-fate-card`}>
                <Grid
                  container
                  direction='row'
                  sx={{ justifyContent: 'space-between' }}
                >
                  <AppPrimaryText>Player Cards</AppPrimaryText>
                  <Tooltip describeChild disableInteractive title='Remove displayed Player cards for the next Year; keep Paths and the remaining deck.'>
                    <AppPrimaryButton onClick={clearPlayerCards}>
                      Clear Player Cards
                    </AppPrimaryButton>
                  </Tooltip>
                </Grid>
                <AppPrimaryButton onClick={playerDeck.draw} disabled={!playerDeck.canDraw}>
                  Draw Player Card
                </AppPrimaryButton>
                <div>Deck: {playerDeck.remainingCount}/{playerDeck.totalCount}</div>
                {prospect && (
                  <section aria-label='Current Prospect'>
                    <AppPrimaryText>Prospect</AppPrimaryText>
                    <PlayerCardContainer card={prospect.card} isProspect />
                  </section>
                )}
                {playerDeck.drawnCards.map((entry) => (
                    <PlayerCardContainer
                      key={`player-${entry.id}`}
                      card={entry.card}
                      addObjectiveCard={() => addObjectiveCard(entry)}
                      addResourceFromPlayerCard={() => addResourceFromPlayerCard(entry)}
                      isPathFull={objectiveCards.length >= 6}
                    />
                  ))}
              </PlayerCardSection>
            </Grid>
          </Grid>
        </AppContainer>
      </AppGradientWrapper>
      )}

      <PrototypeSwitcher
        current={variant}
        onSelect={selectVariant}
        onLoadDemoMidYear={loadDemoMidYear}
        stateSummary={stateSummary}
      />
    </ThemeProvider>
    </StyledThemeProvider>
  );
};

export default App;
