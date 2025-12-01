import { createTheme, Divider, Grid, ThemeProvider } from '@mui/material';
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
import { PlayerCard } from './settings/playerCards.model';
import playerCards from './settings/playerCards';
import PlayerCardContainer from './components/playerCard';
import { nanoid } from 'nanoid';
import ResourceCounterPanel from './components/resourceCounterPanel';
import AICardPanel from './components/AICardPanel';

const muiTheme = createTheme({
  typography: {
    fontFamily: "'Mitr', sans-serif",
  },
});

const App = () => {
  const [initialFateCards, setInitialFateCards] = useState<FateCard[]>(
    fateCards.sort(() => Math.random() - 0.5),
  );
  const [initialPlayerCards, setInitialPlayerCards] = useState<PlayerCard[]>(
    playerCards.sort(() => Math.random() - 0.5),
  );
  const [pickedFateCards, setPickedFateCards] = useState<FateCard[]>([]);
  const [pickedPlayerCards, setPickedPlayerCards] = useState<PlayerCard[]>([]);
  const [objectiveCards, setObjectiveCards] = useState<PlayerCard[]>([]);
  const [AICards, setAICards] = useState<PlayerCard[]>([]);
  const [resourceAmount, setResourceAmount] = useState({
    black: 0,
    blue: 0,
    purple: 0,
    yellow: 0,
    brick: 0,
  });

  const [pictDirectionCount, setPictDirectionCount] = useState({
    left: 0,
    center: 0,
    right: 0,
  });

  const randomFateCard = () => {
    if (initialFateCards.length === 0) {
      const newSetFateCards = fateCards.sort(() => Math.random() - 0.5);
      const fateCard = newSetFateCards[0];
      const fateCardDirection = fateCard.picts_direction;
      const newDirectionCount = {
        ...pictDirectionCount,
        [fateCardDirection]: pictDirectionCount[fateCardDirection] + 1,
      };
      setPictDirectionCount(newDirectionCount);
      setPickedFateCards([fateCard, ...pickedFateCards]);
      const afterRemovedInitialFateCards = newSetFateCards.slice(1);
      setInitialFateCards(afterRemovedInitialFateCards);
    } else {
      const fateCard = initialFateCards[0];
      const fateCardDirection = fateCard.picts_direction;
      const newDirectionCount = {
        ...pictDirectionCount,
        [fateCardDirection]: pictDirectionCount[fateCardDirection] + 1,
      };
      setPictDirectionCount(newDirectionCount);
      setPickedFateCards([fateCard, ...pickedFateCards]);
      const afterRemovedInitialFateCards = initialFateCards.slice(1);
      setInitialFateCards(afterRemovedInitialFateCards);
    }
  };

  const resetDrewFateCards = () => {
    setPictDirectionCount({
      left: 0,
      center: 0,
      right: 0,
    });
    setPickedFateCards([]);
  };

  const randomPlayerCard = () => {
    if (initialPlayerCards.length === 0) {
      const newSetPlayerCards = playerCards.sort(() => Math.random() - 0.5);
      const playerCard = newSetPlayerCards[0];
      setPickedPlayerCards([playerCard, ...pickedPlayerCards]);
      const afterRemovedInitialPlayerCards = newSetPlayerCards.slice(1);
      setInitialPlayerCards(afterRemovedInitialPlayerCards);
    } else {
      const playerCard = initialPlayerCards[0];
      setPickedPlayerCards([playerCard, ...pickedPlayerCards]);
      const afterRemovedInitialPlayerCards = initialPlayerCards.slice(1);
      setInitialPlayerCards(afterRemovedInitialPlayerCards);
    }
  };

  const resetDrewPlayerCards = () => {
    setPickedPlayerCards([]);
  };

  const addObjectiveCard = (card: PlayerCard) => {
    if (objectiveCards.length < 6) {
      setObjectiveCards([...objectiveCards, card]);
      removePickedPlayerCards(card);
    }
  };

  const removePickedPlayerCards = (card: PlayerCard) => {
    let afterRemovePickPlayerCards = pickedPlayerCards.filter(
      (el) => el.name !== card.name,
    );
    setPickedPlayerCards(afterRemovePickPlayerCards);
  };

  const addResourceFromPlayerCard = (card: PlayerCard) => {
    const current = resourceAmount;
    card.resources.forEach((resource: 'black' | 'blue' | 'purple' | 'yellow' | 'brick') => {
      current[resource] = current[resource] + 1;
    });
    setResourceAmount(current);
    removePickedPlayerCards(card);
  };

  const addResourceFromFateCard = (card: FateCard) => {
    const current = resourceAmount;
    card.resource.forEach((resource: 'black' | 'blue' | 'purple' | 'yellow' | 'brick') => {
      current[resource] = current[resource] + 1;
    });
    setResourceAmount(current);
    removePickedFateCards(card);
  };

  const resetResourceAmount = () => {
    setResourceAmount({
      black: 0,
      blue: 0,
      purple: 0,
      yellow: 0,
      brick: 0,
    });
  };

  const removePickedFateCards = (card: FateCard) => {
    let afterRemovePickFateCards = pickedFateCards.filter(
      (el) => JSON.stringify(el) !== JSON.stringify(card),
    );
    const newDirectionCount = {
      ...pictDirectionCount,
      [card.picts_direction]: pictDirectionCount[card.picts_direction] - 1,
    };
    setPictDirectionCount(newDirectionCount);
    setPickedFateCards(afterRemovePickFateCards);
  };

  const sortByArrow = () => {
    const allLeft = pickedFateCards.filter(
      (el) => el.picts_direction === 'left',
    );
    const allCenter = pickedFateCards.filter(
      (el) => el.picts_direction === 'center',
    );
    const allRight = pickedFateCards.filter(
      (el) => el.picts_direction === 'right',
    );
    setPickedFateCards([...allLeft, ...allCenter, ...allRight]);
  };

  const changeResourceAmountByKey = (key: string, amount: number) => {
    const newResourceAmount = { ...resourceAmount, [key]: amount };
    setResourceAmount(newResourceAmount);
  };

  const addAICardFromPlayerCard = (card: PlayerCard) => {
    setAICards([...AICards, card]);
    removePickedPlayerCards(card);
  };

  const clearAICards = () => {
    setAICards([]);
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  console.log(pickedPlayerCards);

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
          <Grid container>
            {/** Grid for Resource Counter and AI Card */}
            <Grid
              item
              container
              xs={4}
              direction='column'
              justifyContent='flex-start'
            >
              <ResourceCounterPanel
                resourceAmount={resourceAmount}
                resetResourceAmount={resetResourceAmount}
                changeResourceAmountByKey={changeResourceAmountByKey}
              />
              <AICardPanel
                AICards={AICards}
                clearAICards={clearAICards}
                addObjectiveCard={addObjectiveCard}
                addAICardFromPlayerCard={addAICardFromPlayerCard}
                addResourceFromPlayerCard={addResourceFromPlayerCard}
              />
            </Grid>
            <Grid item container xs={4}>
              <FateCardSection key={`form-card-fate-card`}>
                <Grid
                  item
                  container
                  direction='row'
                  justifyContent='space-between'
                >
                  <AppPrimaryText>Fate Cards</AppPrimaryText>
                  <AppPrimaryButton onClick={resetDrewFateCards}>
                    Clear
                  </AppPrimaryButton>
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
                <AppPrimaryButton onClick={randomFateCard}>
                  Draw Fate Card
                </AppPrimaryButton>
                <AppPrimaryButton onClick={sortByArrow}>
                  Sort By Arrow
                </AppPrimaryButton>
                {pickedFateCards &&
                  pickedFateCards.map((card) => (
                    <FateCardContainer
                      key={`${nanoid()}-card`}
                      card={card}
                      addResourceFromFateCard={addResourceFromFateCard}
                      removePickedFateCards={removePickedFateCards}
                    />
                  ))}
              </FateCardSection>
            </Grid>
            <Grid item container xs={4}>
              <PlayerCardSection key={`form-card-fate-card`}>
                <Grid
                  item
                  container
                  direction='row'
                  justifyContent='space-between'
                >
                  <AppPrimaryText>Player Cards</AppPrimaryText>
                  <AppPrimaryButton onClick={resetDrewPlayerCards}>
                    Clear
                  </AppPrimaryButton>
                </Grid>
                <AppPrimaryButton onClick={randomPlayerCard}>
                  Draw Player Card
                </AppPrimaryButton>
                {pickedPlayerCards &&
                  pickedPlayerCards.map((card) => (
                    <PlayerCardContainer
                      key={`${nanoid()}-card`}
                      card={card}
                      addObjectiveCard={addObjectiveCard}
                      addResourceFromPlayerCard={addResourceFromPlayerCard}
                      addAICardFromPlayerCard={addAICardFromPlayerCard}
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
