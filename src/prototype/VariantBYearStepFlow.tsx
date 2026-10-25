/**
 * THROWAWAY PROTOTYPE — Variant B: Chronological Year-Step Guided Flow (Turn-Phase Stepper)
 */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircleOutlined,
  Inventory2Outlined,
  PersonOutlined,
  RestartAlt,
} from '@mui/icons-material';
import { PrototypeAppProps } from './prototype.types';
import {
  PictDirectionBadge,
  RESOURCE_KEYS,
  RESOURCE_META,
  ResourcePipsRow,
  ScoreThresholdPills,
  ScoutShapeBadge,
} from './prototypeShared';
import { GladiatorIcon } from '../assets/icons/GladiatorIcon';
import { GoodsIcon } from '../assets/icons/GoodsIcon';
import { HorseIcon } from '../assets/icons/HorseIcon';

const STEPS = [
  { label: '1. Fate &Player Draw', subtitle: 'Draw Fate for resources + 2 Player cards (Path & Prospect)' },
  { label: '2. Build & Neutral Trade', subtitle: 'Spend resources on your sheet & Neutral Trade/Scout cards' },
  { label: '3. Pict Invasion', subtitle: 'Draw base + extra Fate cards to resolve Left/Center/Right attacks' },
  { label: '4. Year Cleanup', subtitle: 'Clear Year cards & advance to the next Year' },
];

export const VariantBYearStepFlow: React.FC<PrototypeAppProps> = (props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [year, setYear] = useState<number>(Math.min(6, Math.max(1, props.objectiveCards.length || 1)));
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const roundInfo = props.rounds.find((r) => r.round === year) ?? props.rounds[0];
  const baseInvasionDraws = roundInfo[difficulty];
  const requiredInvasionDraws = baseInvasionDraws + props.extraInvasionDraws;

  const advanceYearCleanup = () => {
    props.onClearPlayer();
    props.onClearOpponent();
    props.onClearFate();
    setYear((y) => (y < 6 ? y + 1 : 1));
    setActiveStep(0);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: '100px',
        bgcolor: '#f5f0e6',
      }}
    >
      {/* Top Year & Stepper Banner */}
      <Paper
        elevation={2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          bgcolor: '#292524',
          color: '#fafaf9',
          px: { xs: 1.5, sm: 3 },
          py: 1.5,
          borderBottom: '3px solid #c2442a',
        }}
      >
        <Stack sx={{ maxWidth: 1040, mx: 'auto' }} spacing={1.25}>
          <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 900, letterSpacing: 0.5, color: '#fbbf24' }}>
                YEAR {year} OF 6
              </Typography>
              <Stack direction='row' spacing={0.5}>
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <Button
                    key={y}
                    size='small'
                    onClick={() => setYear(y)}
                    sx={{
                      minWidth: 28,
                      height: 26,
                      p: 0,
                      borderRadius: 1,
                      fontWeight: 800,
                      bgcolor: y === year ? '#c2442a' : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  >
                    {y}
                  </Button>
                ))}
              </Stack>
              <Chip
                size='small'
                label={`Valour +${roundInfo.valour}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }}
              />
            </Stack>

            {/* Compact Resource Pill Strip */}
            <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              {RESOURCE_KEYS.map((key) => {
                const meta = RESOURCE_META[key];
                const val = props.resourceAmount[key];
                return (
                  <Stack
                    key={key}
                    direction='row'
                    spacing={0.4}
                    sx={{
                      alignItems: 'center',
                      bgcolor: meta.bg,
                      color: meta.fg,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1.5,
                      border: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800 }}>{meta.short}</Typography>
                    <Button
                      size='small'
                      onClick={() => val > 0 && props.onChangeResource(key, val - 1)}
                      sx={{ minWidth: 20, height: 20, p: 0, color: 'inherit', fontWeight: 900 }}
                    >
                      −
                    </Button>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, minWidth: 14, textAlign: 'center' }}>
                      {val}
                    </Typography>
                    <Button
                      size='small'
                      onClick={() => props.onChangeResource(key, val + 1)}
                      sx={{ minWidth: 20, height: 20, p: 0, color: 'inherit', fontWeight: 900 }}
                    >
                      +
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          {/* Horizontal Guided Stepper */}
          <Stepper nonLinear activeStep={activeStep} sx={{ pt: 0.5 }}>
            {STEPS.map((step, index) => (
              <Step key={step.label}>
                <StepButton
                  onClick={() => setActiveStep(index)}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: index === activeStep ? '#fbbf24 !important' : '#a8a29e !important',
                      fontWeight: index === activeStep ? 800 : 500,
                      fontSize: { xs: '0.72rem', sm: '0.85rem' },
                    },
                  }}
                >
                  {step.label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Paper>

      {/* Step Content Container */}
      <Stack sx={{ maxWidth: 1040, mx: 'auto', px: { xs: 1.5, sm: 3 }, pt: 2.5 }} spacing={2.5}>
        {/* Step Banner Header */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#fff',
            borderLeft: '6px solid #c2442a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 900, color: '#1c1917' }}>
              {STEPS[activeStep].label}
            </Typography>
            <Typography variant='body2' sx={{ color: '#57534e' }}>
              {STEPS[activeStep].subtitle}
            </Typography>
          </Box>
          <Stack direction='row' spacing={1}>
            <Button
              variant='outlined'
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            >
              Prev Phase
            </Button>
            <Button
              variant='contained'
              endIcon={<ArrowForward />}
              onClick={() => setActiveStep((s) => (s < STEPS.length - 1 ? s + 1 : 0))}
              sx={{ bgcolor: '#c2442a', '&:hover': { bgcolor: '#d34f34' } }}
            >
              {activeStep < STEPS.length - 1 ? 'Next Phase' : 'Back to Step 1'}
            </Button>
          </Stack>
        </Paper>

        {/* STEP 0: START OF YEAR DRAW (Fate Resource + 2 Player Cards) */}
        {activeStep === 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
              gap: 2,
            }}
          >
            {/* Left column: 1 Fate card for Year Resources */}
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fff' }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#c2442a' }}>
                  Step 1A · Draw Fate Resource Card
                </Typography>
                <Chip size='small' label={`${props.fateRemaining}/${props.fateTotal}`} />
              </Stack>
              <Typography variant='body2' sx={{ color: '#57534e', mb: 1.5 }}>
                Flip 1 Fate card for your Year&apos;s starting workers &amp; bricks.
              </Typography>
              <Button
                fullWidth
                variant='contained'
                disabled={!props.canDrawFate}
                onClick={props.onDrawFate}
                sx={{ minHeight: 46, bgcolor: '#c2442a', fontWeight: 800, mb: 1.5 }}
              >
                Draw Fate Resource Card
              </Button>
              <Stack spacing={1.25}>
                {props.fateDrawn.map((entry) => (
                  <Paper key={`b-fate-res-${entry.id}`} variant='outlined' sx={{ p: 1.5, borderRadius: 2 }}>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <ResourcePipsRow resources={entry.card.resource} size={18} />
                      <Typography variant='caption' sx={{ fontWeight: 700 }}>
                        Glad {entry.card.gladiator} · Good #{entry.card.goods}
                      </Typography>
                    </Stack>
                    <Button
                      fullWidth
                      size='small'
                      variant='contained'
                      onClick={() => props.onAddResourceFromFate(entry)}
                      sx={{ bgcolor: '#15803d', fontWeight: 700 }}
                    >
                      Collect Starting Resources
                    </Button>
                  </Paper>
                ))}
              </Stack>
            </Paper>

            {/* Right column: Draw 2 Player Cards -> Pick 1 Path + 1 Prospect */}
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fff' }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#c2442a' }}>
                  Step 1B · Draw 2 Player Cards (Pick Path &amp; Prospect)
                </Typography>
                <Chip size='small' label={`Deck ${props.playerRemaining}/${props.playerTotal}`} />
              </Stack>
              <Button
                fullWidth
                variant='contained'
                disabled={!props.canDrawPlayer}
                onClick={props.onDrawPlayer}
                sx={{ minHeight: 46, bgcolor: '#c2442a', fontWeight: 800, mb: 1.5 }}
              >
                Draw Player Card
              </Button>

              {props.prospect && (
                <Paper sx={{ p: 1.5, mb: 1.5, bgcolor: '#fef3c7', border: '1.5px solid #d97706', borderRadius: 2 }}>
                  <Typography variant='caption' sx={{ fontWeight: 800, color: '#92400e' }}>
                    CHOSEN PROSPECT FOR YEAR {year}: {props.prospect.card.name} (Good #{props.prospect.card.goods}, Scout {props.prospect.card.scout})
                  </Typography>
                </Paper>
              )}

              <Stack spacing={1.25}>
                {props.playerDrawn.map((entry) => (
                  <Paper key={`b-player-${entry.id}`} variant='outlined' sx={{ p: 1.5, borderRadius: 2 }}>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>
                        {entry.card.name} — {entry.card.objective}
                      </Typography>
                      <ResourcePipsRow resources={entry.card.resources} size={18} />
                    </Stack>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <ScoreThresholdPills score={entry.card.score} />
                      <Typography variant='caption' sx={{ fontWeight: 700 }}>
                        Good #{entry.card.goods} · Scout {entry.card.scout}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={1}>
                      <Button
                        fullWidth
                        variant='outlined'
                        disabled={props.objectiveCards.length >= 6}
                        onClick={() => props.onAddObjective(entry)}
                        sx={{ borderColor: '#c2442a', color: '#c2442a', fontWeight: 700 }}
                      >
                        Keep as Path ({props.objectiveCards.length}/6)
                      </Button>
                      <Button
                        fullWidth
                        variant='contained'
                        onClick={() => props.onAddResourceFromPlayer(entry)}
                        sx={{ bgcolor: '#c2442a', fontWeight: 700 }}
                      >
                        Take Resource &amp; Prospect
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Box>
        )}

        {/* STEP 1: WORKER SPENDING & NEUTRAL INTERACTION */}
        {activeStep === 1 && (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fff' }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a' }}>
                    Your Prospect &amp; Neutral Trade/Scout Table
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#57534e' }}>
                    Use your own Prospect for free, or pay 1 Brick / 1 Black Soldier on a Neutral card (+1 Invasion Draw each).
                  </Typography>
                </Box>
                <Button
                  variant='contained'
                  disabled={!props.canDrawOpponent}
                  onClick={props.onDrawOpponent}
                  sx={{ bgcolor: '#c2442a', fontWeight: 800, minHeight: 44 }}
                >
                  Draw Neutral Card ({props.opponentRemaining})
                </Button>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 1.5,
                }}
              >
                {props.prospect && (
                  <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: '#fef3c7', border: '2px solid #d97706' }}>
                    <Chip size='small' label='YOUR PROSPECT (0 EXTRA DRAW)' sx={{ bgcolor: '#d97706', color: '#fff', fontWeight: 800, mb: 1 }} />
                    <Typography variant='h6' sx={{ fontWeight: 800 }}>{props.prospect.card.name}</Typography>
                    <Stack direction='row' spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
                      <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Box sx={{ width: 22, height: 22 }}><GoodsIcon /></Box>
                        <Typography sx={{ fontWeight: 800 }}>Good #{props.prospect.card.goods}</Typography>
                      </Stack>
                      <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
                        <ScoutShapeBadge scout={props.prospect.card.scout} size={28} />
                        <Typography sx={{ fontWeight: 800 }}>{props.prospect.card.scout}</Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                )}

                {props.opponentDrawn.map(({ id, card }) => {
                  const usage = props.neutralUses[id] || { resources: 0, soldiers: 0 };
                  return (
                    <Paper key={`b-opp-${id}`} variant='outlined' sx={{ p: 2, borderRadius: 2.5 }}>
                      <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>{card.name}</Typography>
                        <Chip
                          size='small'
                          label={`+${usage.resources + usage.soldiers} Invasion`}
                          color={usage.resources + usage.soldiers > 0 ? 'error' : 'default'}
                        />
                      </Stack>
                      <Stack spacing={1}>
                        <Button
                          fullWidth
                          variant='contained'
                          disabled={props.resourceAmount.brick < 1}
                          onClick={() => props.onUseNeutral(id, 'brick')}
                          sx={{ bgcolor: '#57534e', justifyContent: 'space-between', minHeight: 44 }}
                        >
                          <span>Buy Good #{card.goods} ({usage.resources})</span>
                          <span>1 Brick <Inventory2Outlined sx={{ fontSize: 14 }} /></span>
                        </Button>
                        <Button
                          fullWidth
                          variant='contained'
                          disabled={props.resourceAmount.black < 1}
                          onClick={() => props.onUseNeutral(id, 'black')}
                          sx={{ bgcolor: '#1e293b', justifyContent: 'space-between', minHeight: 44 }}
                        >
                          <span>Scout {card.scout} ({usage.soldiers})</span>
                          <span>1 Black <PersonOutlined sx={{ fontSize: 14 }} /></span>
                        </Button>
                      </Stack>
                    </Paper>
                  );
                })}
              </Box>
            </Paper>
          </Stack>
        )}

        {/* STEP 2: PICT INVASION */}
        {activeStep === 2 && (
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fff' }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a' }}>
                  Year {year} Pict Invasion Calculator
                </Typography>
                <Typography variant='body2' sx={{ color: '#57534e' }}>
                  Base ({difficulty}): <strong>{baseInvasionDraws}</strong> + Neutral Extra: <strong>{props.extraInvasionDraws}</strong> = Total Required Draws: <strong>{requiredInvasionDraws}</strong> (Currently Revealed: {props.fateDrawn.length})
                </Typography>
              </Box>
              <Stack direction='row' spacing={0.75}>
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <Button
                    key={diff}
                    size='small'
                    variant={difficulty === diff ? 'contained' : 'outlined'}
                    onClick={() => setDifficulty(diff)}
                    sx={{ textTransform: 'capitalize', fontWeight: 700 }}
                  >
                    {diff} ({roundInfo[diff]})
                  </Button>
                ))}
              </Stack>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2 }}>
              {(['left', 'center', 'right'] as const).map((dir) => (
                <Paper key={dir} variant='outlined' sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#fef2f2' }}>
                  <Typography variant='overline' sx={{ fontWeight: 800, color: '#991b1b' }}>
                    {dir.toUpperCase()} ATTACKS
                  </Typography>
                  <Typography variant='h3' sx={{ fontWeight: 900, color: '#dc2626' }}>
                    {props.pictDirectionCount[dir]}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Stack direction='row' spacing={1.25} sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant='contained'
                size='large'
                onClick={props.onDrawFate}
                disabled={!props.canDrawFate}
                sx={{ minHeight: 48, bgcolor: '#c2442a', fontWeight: 800 }}
              >
                Draw Invasion Card ({props.fateDrawn.length}/{requiredInvasionDraws} drawn)
              </Button>
              <Button variant='outlined' onClick={props.onSortFate} sx={{ minHeight: 48, fontWeight: 700 }}>
                Sort Arrows
              </Button>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.25 }}>
              {props.fateDrawn.map((entry) => (
                <Paper key={`b-inv-${entry.id}`} variant='outlined' sx={{ p: 1.5, borderRadius: 2 }}>
                  <PictDirectionBadge direction={entry.card.picts_direction} />
                </Paper>
              ))}
            </Box>
          </Paper>
        )}

        {/* STEP 3: END-OF-YEAR CLEANUP & PATH SCOREBOARD */}
        {activeStep === 3 && (
          <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: '#fff' }}>
            <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a', mb: 1 }}>
              End of Year {year} Cleanup &amp; Path Progress ({props.objectiveCards.length}/6)
            </Typography>
            <Typography variant='body2' sx={{ color: '#57534e', mb: 2 }}>
              Clear revealed Fate invasion cards, Neutral placements, and the current Prospect while keeping your chosen Paths and remaining decks.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
              <Button
                size='large'
                variant='contained'
                startIcon={<CheckCircleOutlined />}
                onClick={advanceYearCleanup}
                sx={{ minHeight: 52, bgcolor: '#15803d', fontWeight: 800, flex: 2 }}
              >
                Complete Year {year} Cleanup &amp; Start Year {year < 6 ? year + 1 : 1}
              </Button>
              <Button
                size='large'
                variant='outlined'
                color='error'
                startIcon={<RestartAlt />}
                onClick={props.onOpenNewGame}
                sx={{ minHeight: 52, fontWeight: 700, flex: 1 }}
              >
                New Game
              </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />
            <Typography variant='subtitle1' sx={{ fontWeight: 800, mb: 1.5 }}>
              Retained Scoring Paths ({props.objectiveCards.length}/6)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.25 }}>
              {props.objectiveCards.map(({ id, card }) => (
                <Paper key={`b-path-${id}`} variant='outlined' sx={{ p: 1.5, borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 800, color: '#c2442a' }}>{card.name}</Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>{card.objective}</Typography>
                  <ScoreThresholdPills score={card.score} />
                </Paper>
              ))}
            </Box>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};
