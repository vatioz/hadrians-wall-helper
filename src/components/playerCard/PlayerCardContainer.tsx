import React, { useState } from 'react';
import ColorSquare from '../colorSquare/ColorSquare';
import {
  CardNameText,
  NumberText,
  ObjectiveText,
  CardPrimaryButton,
} from './style';
import { HorseIcon } from '../../assets/icons/HorseIcon';
import { GoodsIcon } from '../../assets/icons/GoodsIcon';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { LIcon } from '../../assets/icons/LIcon';
import { SIcon } from '../../assets/icons/SIcon';
import { LineIcon } from '../../assets/icons/LineIcon';
import { SquareIcon } from '../../assets/icons/SquareIcon';
import { TIcon } from '../../assets/icons/TIcon';
import { PlayerCard } from '../../settings/playerCards.model';

const ScoutContainer = (d: { scout: 'Line' | 'Square' | 'T' | 'L' | 'S' }) => {
  const shape = d.scout;
  switch (shape) {
    case 'L':
      return (
        <div style={{ height: '3em', width: '3em' }}>
          <LIcon />
        </div>
      );
    case 'S':
      return (
        <div style={{ height: '3em', width: '3em' }}>
          <SIcon />
        </div>
      );
    case 'Line':
      return (
        <div style={{ height: '3em', width: '3em' }}>
          <LineIcon />
        </div>
      );
    case 'Square':
      return (
        <div style={{ height: '3em', width: '3em' }}>
          <SquareIcon />
        </div>
      );
    case 'T':
      return (
        <div style={{ height: '3em', width: '3em' }}>
          <TIcon />
        </div>
      );
    default:
      return null;
  }
};

interface Props {
  card: PlayerCard;
  addObjectiveCard?: (card: PlayerCard) => void;
  addResourceFromPlayerCard?: (card: PlayerCard) => void;
  isAI?: boolean;
  isPathFull?: boolean;
}

const PlayerCardContainer: React.FC<Props> = ({
  card,
  addObjectiveCard,
  addResourceFromPlayerCard,
  isAI = false,
  isPathFull = false,
}) => {
  const [isBoughtGoods, setBoughtGoods] = useState(false);
  const [isScout, setScout] = useState(false);
  const mTop = isAI ? '1.25em' : '0.5em';
  return (
    <Stack>
      <div
        style={{
          marginTop: mTop,
          border: '1px solid grey',
          borderRadius: '25px',
          padding: '1em',
        }}
      >
        <Stack>
          <CardNameText>{card.name}</CardNameText>
        </Stack>
        {!isAI && (
          <Stack>
            <ObjectiveText>{card.objective}</ObjectiveText>
            <Grid container direction='row' sx={{ justifyContent: 'space-between' }}>
              {Object.entries(card.score).map(([key, val]) => (
                <NumberText key={key}>
                  {key} : {val}VP
                </NumberText>
              ))}
            </Grid>
          </Stack>
        )}
        <Grid
          container
          direction='row'
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          spacing={0}
        >
          <Grid size={3}>
            <div style={{ height: '2em', width: '2em' }}>
              <GoodsIcon />
            </div>
          </Grid>
          <Grid size={3}>
            <NumberText>{card.goods}</NumberText>
          </Grid>
          <Grid size={3}>
            <div style={{ height: '2em', width: '2em' }}>
              <HorseIcon />
            </div>
          </Grid>
          <Grid size={3}>
            <ScoutContainer scout={card.scout} />
          </Grid>
        </Grid>
        {!isAI && (
          <Grid container direction='row'>
            {card.resources.map((d: 'black' | 'blue' | 'purple' | 'yellow' | 'brick') => {
              switch (d) {
                case 'black':
                  return (
                    <ColorSquare
                      key={`${d}-${card.name}-${Math.random() * 20}`}
                      color={d}
                    />
                  );
                case 'blue':
                  return (
                    <ColorSquare
                      key={`${d}-${card.name}-${Math.random() * 20}`}
                      color={d}
                    />
                  );
                case 'purple':
                  return (
                    <ColorSquare
                      key={`${d}-${card.name}-${Math.random() * 20}`}
                      color={d}
                    />
                  );
                case 'yellow':
                  return (
                    <ColorSquare
                      key={`${d}-${card.name}-${Math.random() * 20}`}
                      color={d}
                    />
                  );
                default:
                  return (
                    <ColorSquare
                      key={`${d}-${card.name}-${Math.random() * 20}`}
                      color={'grey'}
                    />
                  );
              }
            })}
          </Grid>
        )}
        {!isAI && (
          <Grid container direction='row'>
            <CardPrimaryButton
              onClick={() => addObjectiveCard && addObjectiveCard(card)}
              disabled={isPathFull}
            >
              As Path
            </CardPrimaryButton>
            <CardPrimaryButton onClick={() => addResourceFromPlayerCard && addResourceFromPlayerCard(card)}>
              As Resource
            </CardPrimaryButton>
          </Grid>
        )}
        {isAI && (
          <>
            <Grid container direction='row'>
              <CardPrimaryButton
                onClick={() => setBoughtGoods(!isBoughtGoods)}
              >
                {isBoughtGoods ? '✓ Bought Goods' : 'Buy Goods'}
              </CardPrimaryButton>
              <CardPrimaryButton
                onClick={() => setScout(!isScout)}
              >
                {isScout ? '✓ Scouted' : 'Scout'}
              </CardPrimaryButton>
            </Grid>
          </>
        )}
      </div>
    </Stack>
  );
};

export default PlayerCardContainer;
