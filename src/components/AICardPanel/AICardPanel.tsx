import React from 'react';
import { ResourceCounterCard } from './style';
import Grid from '@mui/material/Grid/Grid';
import { AppPrimaryButton, AppPrimaryText } from '../../App.styled';
import PlayerCardContainer from '../playerCard';
import { PlayerCard } from '../../settings/playerCards.model';

interface Props {
  clearAICards: () => void;
  AICards: PlayerCard[];
  addObjectiveCard: (card: PlayerCard) => void;
  addResourceFromPlayerCard: (card: PlayerCard) => void;
  addAICardFromPlayerCard: (card: PlayerCard) => void;
}

const AICardPanel: React.FC<Props> = ({
  clearAICards,
  AICards,
  addObjectiveCard,
  addResourceFromPlayerCard,
  addAICardFromPlayerCard,
}) => {
  return (
    <ResourceCounterCard>
      <Grid item container direction='column'>
        <Grid item container direction='row' justifyContent='space-between'>
          <AppPrimaryText>AI Cards</AppPrimaryText>
          <AppPrimaryButton onClick={clearAICards}>Clear</AppPrimaryButton>
        </Grid>
        {AICards &&
          AICards.map((card) => (
            <PlayerCardContainer
              key={`${card.name}-card`}
              isAI={true}
              card={card}
              addObjectiveCard={addObjectiveCard}
              addResourceFromPlayerCard={addResourceFromPlayerCard}
              addAICardFromPlayerCard={addAICardFromPlayerCard}
            />
          ))}
      </Grid>
    </ResourceCounterCard>
  );
};

export default AICardPanel;
