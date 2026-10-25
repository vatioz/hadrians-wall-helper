/**
 * THROWAWAY PROTOTYPE — Shared visual primitives for mobile/tablet layout variants
 */
import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { appPalette } from '../theme';
import { LIcon } from '../assets/icons/LIcon';
import { SIcon } from '../assets/icons/SIcon';
import { LineIcon } from '../assets/icons/LineIcon';
import { SquareIcon } from '../assets/icons/SquareIcon';
import { TIcon } from '../assets/icons/TIcon';
import { LeftArrow } from '../assets/icons/LeftArrow';
import { RightArrow } from '../assets/icons/RightArrow';
import { UpArrow } from '../assets/icons/UpArrow';
import { Resource } from '../gameSession';

export const RESOURCE_META: Record<
  Resource,
  { label: string; short: string; role: string; bg: string; fg: string; border: string }
> = {
  black: {
    label: 'Black',
    short: 'BLK',
    role: 'Soldier',
    bg: '#1f242d',
    fg: '#ffffff',
    border: '#111',
  },
  blue: {
    label: 'Blue',
    short: 'BLU',
    role: 'Builder',
    bg: '#1d5fa7',
    fg: '#ffffff',
    border: '#14447a',
  },
  purple: {
    label: 'Purple',
    short: 'PUR',
    role: 'Servant',
    bg: '#6d3089',
    fg: '#ffffff',
    border: '#4f2065',
  },
  yellow: {
    label: 'Yellow',
    short: 'YEL',
    role: 'Civilian',
    bg: '#e5b822',
    fg: '#1b1b1b',
    border: '#b89011',
  },
  brick: {
    label: 'Brick',
    short: 'BRK',
    role: 'Resource',
    bg: '#7d828a',
    fg: '#ffffff',
    border: '#5a5f66',
  },
};

export const RESOURCE_KEYS: Resource[] = ['black', 'blue', 'purple', 'yellow', 'brick'];

export const ScoutShapeBadge: React.FC<{
  scout: 'Line' | 'Square' | 'T' | 'L' | 'S';
  size?: number;
}> = ({ scout, size = 28 }) => {
  const renderIcon = () => {
    switch (scout) {
      case 'L':
        return <LIcon />;
      case 'S':
        return <SIcon />;
      case 'Line':
        return <LineIcon />;
      case 'Square':
        return <SquareIcon />;
      case 'T':
        return <TIcon />;
      default:
        return null;
    }
  };
  return (
    <Box
      role='img'
      aria-label={`${scout} Scouting Pattern`}
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {renderIcon()}
    </Box>
  );
};

export const PictDirectionBadge: React.FC<{
  direction: 'left' | 'center' | 'right';
  size?: number;
}> = ({ direction, size = 28 }) => {
  const map = {
    left: { label: 'Left', icon: <LeftArrow />, bg: '#fbe9e7', border: '#c2442a' },
    center: { label: 'Center', icon: <UpArrow />, bg: '#fff8e1', border: '#e65100' },
    right: { label: 'Right', icon: <RightArrow />, bg: '#e8eaf6', border: '#3949ab' },
  }[direction];

  return (
    <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: size,
          height: size,
          p: 0.4,
          borderRadius: 1.5,
          bgcolor: map.bg,
          border: `1.5px solid ${map.border}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {map.icon}
      </Box>
      <Typography variant='subtitle2' sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {map.label}
      </Typography>
    </Stack>
  );
};

export const ResourcePipsRow: React.FC<{
  resources: Resource[];
  size?: number;
}> = ({ resources, size = 18 }) => (
  <Stack direction='row' spacing={0.5} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
    {resources.map((res, idx) => {
      const meta = RESOURCE_META[res];
      return (
        <Box
          key={`${res}-${idx}`}
          title={`${meta.label} (${meta.role})`}
          sx={{
            width: size,
            height: size,
            borderRadius: 0.8,
            bgcolor: meta.bg,
            border: `1.5px solid ${meta.border}`,
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25)',
          }}
        />
      );
    })}
  </Stack>
);

export const ScoreThresholdPills: React.FC<{
  score: Record<string, number | undefined>;
}> = ({ score }) => (
  <Stack direction='row' spacing={0.75} sx={{ flexWrap: 'wrap' }}>
    {Object.entries(score).map(([threshold, vp]) => (
      <Chip
        key={threshold}
        size='small'
        label={`${threshold} -> ${vp}VP`}
        sx={{
          height: 22,
          fontSize: '0.72rem',
          fontWeight: 700,
          bgcolor: 'rgba(194, 68, 42, 0.12)',
          color: appPalette.brand,
          border: '1px solid rgba(194, 68, 42, 0.3)',
        }}
      />
    ))}
  </Stack>
);
