import React from 'react';
import ColorSquare from '../colorSquare/ColorSquare';
import {
  ArrowLeftContainer,
  ArrowRightContainer,
  ArrowCenterContainer,
  NumberText,
  MiddleContainer,
  CardPrimaryButton,
} from './style';
import { GladiatorIcon } from '../../assets/icons/GladiatorIcon';
import { GoodsIcon } from '../../assets/icons/GoodsIcon';
import { LeftArrow } from '../../assets/icons/LeftArrow';
import { RightArrow } from '../../assets/icons/RightArrow';
import { UpArrow } from '../../assets/icons/UpArrow';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { FateCard } from '../../settings/fateCards.model';
import { nanoid } from 'nanoid';

interface Props {
  card: FateCard;
  addResourceFromFateCard: (card: FateCard) => void;
  removePickedFateCards: (card: FateCard) => void;
}

const ArrowContainer = (d: { direction: 'left' | 'center' | 'right' }) => {
  const direction = d.direction;
  switch (direction) {
    case 'left':
      return (
        <ArrowLeftContainer>
          <div style={{ height: '2.5em', width: '2.5em' }}>
            <LeftArrow />
          </div>
        </ArrowLeftContainer>
      );
    case 'right':
      return (
        <ArrowRightContainer>
          <div style={{ height: '2.5em', width: '2.5em' }}>
            <RightArrow />
          </div>
        </ArrowRightContainer>
      );
    case 'center':
      return (
        <ArrowCenterContainer>
          <div style={{ height: '2.5em', width: '2.5em' }}>
            <UpArrow />
          </div>
        </ArrowCenterContainer>
      );
    default:
      return null;
  }
};

const FateCardContainer: React.FC<Props> = ({
  card,
  addResourceFromFateCard,
  removePickedFateCards,
}) => {
  const { app } = useTheme().palette;
  return (
    <Stack>
      <div
        style={{
          marginTop: '0.5em',
          border: `1px solid ${app.outline}`,
          borderRadius: '25px',
          padding: '1em',
        }}
      >
        <ArrowContainer direction={card.picts_direction} />
        <MiddleContainer>
          <div style={{ height: '2em', width: '2em' }}>
            <GladiatorIcon />
          </div>
          <NumberText>{card.gladiator}</NumberText>
          <div style={{ height: '2em', width: '2em' }}>
            <GoodsIcon />
          </div>
          <NumberText>{card.goods}</NumberText>
        </MiddleContainer>
        <Grid container direction='row'>
          {card.resource.map((d: 'black' | 'blue' | 'purple' | 'yellow' | 'brick') => (
            <ColorSquare key={`${d}-${nanoid()}`} color={app.resource[d]} />
          ))}
        </Grid>
        <Grid container direction='row'>
          <CardPrimaryButton onClick={() => addResourceFromFateCard(card)}>
            As Resource
          </CardPrimaryButton>
          <CardPrimaryButton onClick={() => removePickedFateCards(card)}>
            Discard
          </CardPrimaryButton>
        </Grid>
      </div>
    </Stack>
  );
};

export default FateCardContainer;
