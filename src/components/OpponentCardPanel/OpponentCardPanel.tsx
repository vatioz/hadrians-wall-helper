import React from 'react';
import Grid from '@mui/material/Grid/Grid';
import { AppPrimaryButton, AppPrimaryText, ResourceCounterCard } from '../../App.styled';
import PlayerCardContainer from '../playerCard';
import { NeutralCardUsage, PlayerCard } from '../../settings/playerCards.model';
import { DrawnCard } from '../../hooks/useDeck';

interface Props {
  clearOpponentCards: () => void;
  opponentCards: DrawnCard<PlayerCard>[];
  randomOpponentCard: () => void;
  neutralUses: Record<number, NeutralCardUsage>;
  canBuyGoods: boolean;
  canScout: boolean;
  onNeutralUse: (id: number, resource: 'brick' | 'black') => void;
}

const OpponentCardPanel: React.FC<Props> = ({
  clearOpponentCards,
  opponentCards,
  randomOpponentCard,
  neutralUses,
  canBuyGoods,
  canScout,
  onNeutralUse: recordNeutralUse,
}) => {
  const extraDraws = opponentCards.reduce((total, { id }) => {
    const usage = neutralUses[id];
    return total + (usage ? usage.resources + usage.soldiers : 0);
  }, 0);
  return (
    <ResourceCounterCard>
      <Grid item container direction='row' justifyContent='space-between'>
        <AppPrimaryText>Opponent Cards</AppPrimaryText>
        <AppPrimaryButton aria-label='Clear Opponent Cards' onClick={clearOpponentCards}>Clear</AppPrimaryButton>
      </Grid>
      <AppPrimaryButton onClick={randomOpponentCard}>
        Draw Opponent Card
      </AppPrimaryButton>
      <div role='status'>Extra Invasion Draws: {extraDraws}</div>
      {opponentCards &&
        opponentCards.map(({ id, card }) => (
          <PlayerCardContainer
            key={`opponent-${id}`}
            isAI={true}
            card={card}
            neutralUsage={neutralUses[id]}
            canBuyGoods={canBuyGoods}
            canScout={canScout}
            onUseNeutral={(resource) => recordNeutralUse(id, resource)}
          />
        ))}
    </ResourceCounterCard>
  );
};

export default OpponentCardPanel;
