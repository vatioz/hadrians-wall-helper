import React from 'react';
import { ResourceCounterCard } from './style';
import Grid from '@mui/material/Grid/Grid';
import { AppPrimaryButton, AppPrimaryText } from '../../App.styled';
import PlayerCardContainer from '../playerCard';
import { PlayerCard } from '../../settings/playerCards.model';

interface Props {
  clearOpponentCards: () => void;
  opponentCards: PlayerCard[];
  randomOpponentCard: () => void;
}

const OpponentCardPanel: React.FC<Props> = ({
  clearOpponentCards,
  opponentCards,
  randomOpponentCard,
}) => {
  return (
    <ResourceCounterCard>
      <Grid item container direction='column'>
        <Grid item container direction='row' justifyContent='space-between'>
          <AppPrimaryText>Opponent Cards</AppPrimaryText>
          <AppPrimaryButton onClick={clearOpponentCards}>Clear</AppPrimaryButton>
        </Grid>
        <AppPrimaryButton onClick={randomOpponentCard}>
          Draw Opponent Card
        </AppPrimaryButton>
        {opponentCards &&
          opponentCards.map((card) => (
            <PlayerCardContainer
              key={`${card.name}-card`}
              isAI={true}
              card={card}
            />
          ))}
      </Grid>
    </ResourceCounterCard>
  );
};

export default OpponentCardPanel;
