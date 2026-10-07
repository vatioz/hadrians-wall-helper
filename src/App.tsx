import { createTheme, Divider, Grid, ThemeProvider, Tooltip } from '@mui/material';
import { useState } from 'react';
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
  RoundSecondaryText,
  RoundTrackContainer,
} from './App.styled';
import FateCardContainer from './components/fateCard';
import fateCards from './settings/fateCards';
import rounds from './settings/rounds';
import { FateCard } from './settings/fateCards.model';
import { NeutralCardUsage, PlayerCard } from './settings/playerCards.model';
import playerCards from './settings/playerCards';
import opponentCards from './settings/opponentCards';
import PlayerCardContainer from './components/playerCard';
import ResourceCounterPanel from './components/resourceCounterPanel';
import OpponentCardPanel from './components/OpponentCardPanel';
import { DrawnCard, useDeck } from './hooks/useDeck';

const muiTheme = createTheme({
  typography: {
    fontFamily: "'Mitr', sans-serif",
  },
});

const App = () => {
  const fateDeck = useDeck(fateCards);
  const playerDeck = useDeck(playerCards);
  const opponentDeck = useDeck(opponentCards);
  const [objectiveCards, setObjectiveCards] = useState<PlayerCard[]>([]);
  const [resourceState, setResourceState] = useState({
    amount: { black: 0, blue: 0, purple: 0, yellow: 0, brick: 0 },
    neutralUses: {} as Record<number, NeutralCardUsage>,
  });
  const resourceAmount = resourceState.amount;

  const pictDirectionCount = fateDeck.drawnCards.reduce((counts, { card }) => ({
    ...counts,
    [card.picts_direction]: counts[card.picts_direction] + 1,
  }), { left: 0, center: 0, right: 0 });

  const addObjectiveCard = (entry: DrawnCard<PlayerCard>) => {
    if (objectiveCards.length < 6) {
      setObjectiveCards([...objectiveCards, entry.card]);
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
    playerDeck.discard(entry.id);
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

  return (
    <ThemeProvider theme={muiTheme}>
      <AppGradientWrapper>
        <AppContainer>
          <AppHeaderContainer>
            <AppPrimaryText>Hadrian's Wall Solo Helper</AppPrimaryText>
          </AppHeaderContainer>
          <RoundTrackContainer>
            <Grid container spacing={3}>
              {rounds &&
                rounds.map((round) => (
                  <Grid
                    item
                    container
                    direction='column'
                    alignItems='center'
                    xs={2}
                    key={`${round.round}-round`}
                  >
                    <RoundPrimaryText>Round {round.round}</RoundPrimaryText>
                    <Grid item container direction='column'>
                      <Grid
                        item
                        container
                        direction='row'
                        justifyContent='space-between'
                      >
                        <RoundSecondaryText color='green'>
                          Easy
                        </RoundSecondaryText>
                        <RoundSecondaryText color='green'>
                          {round.easy}
                        </RoundSecondaryText>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        justifyContent='space-between'
                      >
                        <RoundSecondaryText color='orange'>
                          Medium
                        </RoundSecondaryText>
                        <RoundSecondaryText color='orange'>
                          {round.medium}
                        </RoundSecondaryText>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        justifyContent='space-between'
                      >
                        <RoundSecondaryText color='red'>
                          Hard
                        </RoundSecondaryText>
                        <RoundSecondaryText color='red'>
                          {round.hard}
                        </RoundSecondaryText>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        justifyContent='space-between'
                      >
                        <RoundSecondaryText color='grey'>
                          Valour
                        </RoundSecondaryText>
                        <RoundSecondaryText color='grey'>
                          {round.valour}
                        </RoundSecondaryText>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
            </Grid>
            <Divider />
            <Grid container spacing={3}>
              {objectiveCards &&
                objectiveCards.map((card) => (
                  <Grid
                    item
                    container
                    direction='column'
                    alignItems='center'
                    xs={2}
                  >
                    <RoundPrimaryText>{card.name}</RoundPrimaryText>
                    <ObjectiveExplainText
                      fontWeight={300}
                      fontSize={'0.8em'}
                      color='black'
                    >
                      {card.objective}
                    </ObjectiveExplainText>
                    <Grid
                      item
                      container
                      direction='row'
                      justifyContent='space-between'
                    >
                      {Object.entries(card.score).map(([key, val]) => (
                        <ObjectiveScoreText fontWeight={500} fontSize={'0.8em'}>
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
              item
              xs={12}
              md={4}
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
                neutralUses={resourceState.neutralUses}
                canBuyGoods={resourceAmount.brick > 0}
                canScout={resourceAmount.black > 0}
                onNeutralUse={useNeutralCard}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FateCardSection key={`form-card-fate-card`}>
                <Grid
                  item
                  container
                  direction='row'
                  justifyContent='space-between'
                >
                  <AppPrimaryText>Fate Cards</AppPrimaryText>
                  <Tooltip describeChild title='Remove revealed Fate cards and attack totals after resolving the invasion. Do not reshuffle the deck.'>
                    <AppPrimaryButton onClick={fateDeck.clear}>
                      Clear Invasion
                    </AppPrimaryButton>
                  </Tooltip>
                </Grid>
                <Grid
                  item
                  container
                  direction='row'
                  justifyContent='space-between'
                >
                  {Object.entries(pictDirectionCount).map(([key, val]) => (
                    <RoundSecondaryText color={'black'} key={key}>
                      {capitalizeFirstLetter(key)} : {val}
                    </RoundSecondaryText>
                  ))}
                </Grid>
                <AppPrimaryButton onClick={fateDeck.draw}>
                  Draw Fate Card
                </AppPrimaryButton>
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
            <Grid item xs={12} md={4}>
              <PlayerCardSection key={`form-card-fate-card`}>
                <Grid
                  item
                  container
                  direction='row'
                  justifyContent='space-between'
                >
                  <AppPrimaryText>Player Cards</AppPrimaryText>
                  <Tooltip describeChild title='Remove displayed Player cards for the next Year; keep Paths and the remaining deck.'>
                    <AppPrimaryButton onClick={playerDeck.clear}>
                      Clear Player Cards
                    </AppPrimaryButton>
                  </Tooltip>
                </Grid>
                <AppPrimaryButton onClick={playerDeck.draw}>
                  Draw Player Card
                </AppPrimaryButton>
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
    </ThemeProvider>
  );
};

export default App;
