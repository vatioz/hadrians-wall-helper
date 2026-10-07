import React from 'react';
import Grid from '@mui/material/Grid';
import { AppPrimaryButton, AppPrimaryText, ResourceCounterCard } from '../../App.styled';
import PlayerCardContainer from '../playerCard';
import { PlayerCard } from '../../settings/playerCards.model';
import { DrawnCard } from '../../hooks/useDeck';

interface Props {
  clearOpponentCards: () => void;
  opponentCards: DrawnCard<PlayerCard>[];
  randomOpponentCard: () => void;
}

const OpponentCardPanel: React.FC<Props> = ({
  clearOpponentCards,
  opponentCards,
  randomOpponentCard,
}) => {
  return (
    <ResourceCounterCard>
      <Grid container direction='row' sx={{ justifyContent: 'space-between' }}>
        <AppPrimaryText>Opponent Cards</AppPrimaryText>
        <AppPrimaryButton aria-label='Clear Opponent Cards' onClick={clearOpponentCards}>Clear</AppPrimaryButton>
      </Grid>
      <AppPrimaryButton onClick={randomOpponentCard}>
        Draw Opponent Card
      </AppPrimaryButton>
      {opponentCards &&
        opponentCards.map(({ id, card }) => (
          <PlayerCardContainer
            key={`opponent-${id}`}
            isAI={true}
            card={card}
          />
        ))}
    </ResourceCounterCard>
  );
};

export default OpponentCardPanel;
