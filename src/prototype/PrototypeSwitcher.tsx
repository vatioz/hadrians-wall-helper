/**
 * THROWAWAY PROTOTYPE — Floating bottom variant switcher bar (per prototype/UI.md)
 */
import React, { useEffect } from 'react';
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import { ArrowBack, ArrowForward, AutoAwesome } from '@mui/icons-material';
import { PROTOTYPE_VARIANTS, PrototypeVariantKey } from './prototype.types';

interface Props {
  current: PrototypeVariantKey;
  onSelect: (variant: PrototypeVariantKey) => void;
  onLoadDemoMidYear: () => void;
  stateSummary: string;
}

export const PrototypeSwitcher: React.FC<Props> = ({
  current,
  onSelect,
  onLoadDemoMidYear,
  stateSummary,
}) => {
  const currentIndex = Math.max(
    0,
    PROTOTYPE_VARIANTS.findIndex((v) => v.key === current),
  );
  const currentMeta = PROTOTYPE_VARIANTS[currentIndex] ?? PROTOTYPE_VARIANTS[0];

  const cycle = (delta: number) => {
    const nextIndex = (currentIndex + delta + PROTOTYPE_VARIANTS.length) % PROTOTYPE_VARIANTS.length;
    onSelect(PROTOTYPE_VARIANTS[nextIndex].key);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        cycle(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        cycle(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Box
      role='region'
      aria-label='Prototype variant switcher'
      sx={{
        position: 'fixed',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1400,
        width: 'min(96vw, 860px)',
        pointerEvents: 'none',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          pointerEvents: 'auto',
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
          bgcolor: '#090d16',
          color: '#f8fafc',
          border: '2px solid #f59e0b',
          boxShadow: '0 10px 30px rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <IconButton
          size='small'
          aria-label='Previous layout variant'
          onClick={() => cycle(-1)}
          sx={{ color: '#fbbf24', bgcolor: 'rgba(251, 191, 36, 0.12)' }}
        >
          <ArrowBack fontSize='small' />
        </IconButton>

        <Stack
          direction='row'
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            flex: 1,
            flexWrap: 'wrap',
          }}
        >
          <Chip
            size='small'
            label='PROTOTYPE'
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 900,
              bgcolor: '#f59e0b',
              color: '#090d16',
            }}
          />
          <Typography
            variant='body2'
            sx={{
              fontWeight: 800,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentMeta.key} ({currentMeta.name})
          </Typography>
          <Typography
            variant='caption'
            sx={{
              color: '#94a3b8',
              display: { xs: 'none', md: 'inline' },
            }}
          >
            · {stateSummary}
          </Typography>
        </Stack>

        <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
          <Button
            size='small'
            onClick={onLoadDemoMidYear}
            startIcon={<AutoAwesome sx={{ fontSize: '14px !important' }} />}
            sx={{
              color: '#38bdf8',
              borderColor: 'rgba(56,189,248,0.4)',
              fontSize: '0.7rem',
              textTransform: 'none',
              fontWeight: 700,
              py: 0.25,
              px: 1,
              minWidth: 0,
              display: { xs: 'none', sm: 'inline-flex' },
            }}
            variant='outlined'
          >
            Seed Demo
          </Button>
          <IconButton
            size='small'
            aria-label='Next layout variant'
            onClick={() => cycle(1)}
            sx={{ color: '#fbbf24', bgcolor: 'rgba(251, 191, 36, 0.12)' }}
          >
            <ArrowForward fontSize='small' />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
};
