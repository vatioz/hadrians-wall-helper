import React from 'react';
import { Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Inventory2Outlined, PersonOutlined } from '@mui/icons-material';
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
import { NeutralCardUsage, PlayerCard } from '../../settings/playerCards.model';

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
  isProspect?: boolean;
  neutralUsage?: NeutralCardUsage;
  canBuyGoods?: boolean;
  canScout?: boolean;
  onUseNeutral?: (resource: 'brick' | 'black') => void;
}

const PlayerCardContainer: React.FC<Props> = ({
  card,
  addObjectiveCard,
  addResourceFromPlayerCard,
  isAI = false,
  isPathFull = false,
  isProspect = false,
  neutralUsage = { resources: 0, soldiers: 0 },
  canBuyGoods = false,
  canScout = false,
  onUseNeutral,
}) => {
  const mTop = isAI ? '1.25em' : '0.5em';
  const { app } = useTheme().palette;
  return (
    <Stack component='section' aria-label={isAI ? `Neutral card ${card.name}` : undefined}>
      <div
        style={{
          marginTop: mTop,
          border: `1px solid ${app.outline}`,
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
            <NumberText aria-label={`Trade Good ${card.goods}`}>{card.goods}</NumberText>
          </Grid>
          <Grid size={3}>
            <div style={{ height: '2em', width: '2em' }}>
              <HorseIcon />
            </div>
          </Grid>
          <Grid size={3}>
            <div role='img' aria-label={`${card.scout} Scouting Pattern`}>
              <ScoutContainer scout={card.scout} />
            </div>
          </Grid>
        </Grid>
        {!isAI && (
          <Grid container direction='row'>
            {card.resources.map((resource, index) => (
              <ColorSquare
                key={`${resource}-${index}`}
                color={app.resource[resource]}
              />
            ))}
          </Grid>
        )}
        {!isAI && !isProspect && (
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
            <Stack sx={{ fontSize: '0.875em', margin: '0.5em 0' }}>
              <span>Resources placed: {neutralUsage.resources}</span>
              <span>Soldiers placed: {neutralUsage.soldiers}</span>
            </Stack>
            <Grid container direction='row' sx={{ gap: 1 }}>
              <Tooltip describeChild title='Spend 1 Resource (Brick); add 1 invasion draw.'>
                <span tabIndex={canBuyGoods ? -1 : 0}>
                  <CardPrimaryButton aria-label='Buy Goods' disabled={!canBuyGoods} onClick={() => onUseNeutral && onUseNeutral('brick')}>
                    Buy Goods <Inventory2Outlined sx={{ fontSize: 16, marginLeft: 1, marginRight: 0.5 }} /> 1
                  </CardPrimaryButton>
                </span>
              </Tooltip>
              <Tooltip describeChild title='Spend 1 Soldier (Black); add 1 invasion draw.'>
                <span tabIndex={canScout ? -1 : 0}>
                  <CardPrimaryButton aria-label='Scout' disabled={!canScout} onClick={() => onUseNeutral && onUseNeutral('black')}>
                    Scout <PersonOutlined sx={{ fontSize: 16, marginLeft: 1, marginRight: 0.5 }} /> 1
                  </CardPrimaryButton>
                </span>
              </Tooltip>
            </Grid>
          </>
        )}
      </div>
    </Stack>
  );
};

export default PlayerCardContainer;
