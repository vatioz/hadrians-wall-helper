/**
 * THROWAWAY PROTOTYPE — Variant C: Tablet Split-Pane "Roman War Room" + Mobile Horizontal Snap Rails
 */
import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
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

const railContainerSx = {
  display: 'flex',
  gap: 1.5,
  overflowX: 'auto',
  pb: 1,
  scrollSnapType: 'x mandatory',
  '& > *': {
    scrollSnapAlign: 'start',
    flex: '0 0 auto',
    width: { xs: '272px', sm: '286px' },
  },
} as const;

export const VariantCTabletSplitRails: React.FC<PrototypeAppProps> = (props) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: '96px',
        bgcolor: '#0f172a',
        color: '#f8fafc',
      }}
    >
      {/* Split-Pane Grid: Sticky Left Rail on Tablet/Desktop, Stacked + Horizontal Rails on Mobile */}
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          p: { xs: 1.5, md: 2.5 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '340px minmax(0, 1fr)' },
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        {/* LEFT PANE: Sticky Command & Resource Console */}
        <Paper
          elevation={6}
          sx={{
            position: { md: 'sticky' },
            top: { md: 20 },
            p: 2,
            borderRadius: 3.5,
            bgcolor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          }}
        >
          <Stack spacing={2}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant='overline' sx={{ color: '#f59e0b', fontWeight: 800, lineHeight: 1 }}>
                  WAR ROOM CONSOLE
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                  Hadrian&apos;s Wall
                </Typography>
              </Box>
              <Stack direction='row' spacing={0.75}>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={props.onLoadDemoMidYear}
                  title='Populate Mid-Game State'
                  sx={{ minWidth: 36, color: '#38bdf8', borderColor: '#0284c7' }}
                >
                  <AutoAwesome fontSize='small' />
                </Button>
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  onClick={props.onOpenNewGame}
                  title='New Game'
                  sx={{ minWidth: 36 }}
                >
                  <RestartAlt fontSize='small' />
                </Button>
              </Stack>
            </Stack>

            {/* Tactile Resource Rows */}
            <Box>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant='caption' sx={{ fontWeight: 800, color: '#94a3b8', letterSpacing: 0.6 }}>
                  RESOURCE POOL
                </Typography>
                <Button
                  size='small'
                  onClick={props.onResetResources}
                  sx={{ color: '#f87171', fontSize: '0.72rem', p: 0, minWidth: 0 }}
                >
                  Zero All
                </Button>
              </Stack>

              <Stack spacing={0.85}>
                {RESOURCE_KEYS.map((key) => {
                  const meta = RESOURCE_META[key];
                  const val = props.resourceAmount[key];
                  return (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#0f172a',
                        borderRadius: 2,
                        p: 0.75,
                        pl: 1.25,
                        borderLeft: `6px solid ${meta.bg}`,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.1 }}>
                          {meta.label}
                        </Typography>
                        <Typography variant='caption' sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                          {meta.role}
                        </Typography>
                      </Box>

                      <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                        <Button
                          variant='outlined'
                          onClick={() => val > 0 && props.onChangeResource(key, val - 1)}
                          disabled={val <= 0}
                          sx={{
                            minWidth: 38,
                            height: 36,
                            borderRadius: 1.5,
                            color: '#f8fafc',
                            borderColor: '#475569',
                            fontWeight: 900,
                          }}
                        >
                          −
                        </Button>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', minWidth: 24, textAlign: 'center' }}>
                          {val}
                        </Typography>
                        <Button
                          variant='contained'
                          onClick={() => props.onChangeResource(key, val + 1)}
                          sx={{
                            minWidth: 38,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: meta.bg,
                            color: meta.fg,
                            fontWeight: 900,
                            '&:hover': { bgcolor: meta.bg, opacity: 0.9 },
                          }}
                        >
                          +
                        </Button>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Divider sx={{ borderColor: '#334155' }} />

            {/* Compact 6-Year Matrix Table */}
            <Box>
              <Typography variant='caption' sx={{ fontWeight: 800, color: '#94a3b8', letterSpacing: 0.6, display: 'block', mb: 1 }}>
                INVASION THREAT TABLE (+{props.extraInvasionDraws} EXTRA)
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 0.5,
                  textAlign: 'center',
                  bgcolor: '#0f172a',
                  p: 1,
                  borderRadius: 2,
                }}
              >
                {props.rounds.map((r) => (
                  <Box key={r.round} sx={{ p: 0.4, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.03)' }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b' }}>Y{r.round}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#4ade80' }}>{r.easy}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#fb923c' }}>{r.medium}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#f87171' }}>{r.hard}</Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>V{r.valour}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#334155' }} />

            {/* Retained Paths Mini-List */}
            <Box>
              <Typography variant='caption' sx={{ fontWeight: 800, color: '#94a3b8', letterSpacing: 0.6, display: 'block', mb: 1 }}>
                RETAINED PATHS ({props.objectiveCards.length}/6)
              </Typography>
              <Stack spacing={0.75}>
                {props.objectiveCards.length === 0 && (
                  <Typography variant='caption' sx={{ color: '#64748b' }}>
                    No Paths selected yet. Draw a Player card and choose &ldquo;As Path&rdquo;.
                  </Typography>
                )}
                {props.objectiveCards.map(({ id, card }) => (
                  <Box
                    key={`c-path-${id}`}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: '#0f172a',
                      border: '1px solid #334155',
                    }}
                  >
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#fbbf24' }}>
                        {card.name}
                      </Typography>
                      <Typography variant='caption' sx={{ color: '#cbd5e1' }}>
                        {Object.entries(card.score).map(([k, v]) => `${k}:${v}VP`).join(' · ')}
                      </Typography>
                    </Stack>
                    <Typography variant='caption' sx={{ color: '#94a3b8', display: 'block' }}>
                      {card.objective}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* RIGHT PANE: Three Horizontal Snap-Scroll Card Rails */}
        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
          {/* RAIL 1: PLAYER DECK & PROSPECT */}
          <Paper sx={{ p: 2, borderRadius: 3.5, bgcolor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 900, color: '#fbbf24' }}>
                  Player Deck Rail
                </Typography>
                <Chip
                  size='small'
                  label={`${props.playerRemaining}/${props.playerTotal} left`}
                  sx={{ bgcolor: '#0f172a', color: '#e2e8f0', fontWeight: 700 }}
                />
              </Stack>
              <Stack direction='row' spacing={1}>
                <Button
                  variant='contained'
                  disabled={!props.canDrawPlayer}
                  onClick={props.onDrawPlayer}
                  sx={{ bgcolor: '#c2442a', fontWeight: 800, minHeight: 40 }}
                >
                  + Draw Player
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onClearPlayer}
                  sx={{ color: '#cbd5e1', borderColor: '#475569', minHeight: 40 }}
                >
                  Clear Year
                </Button>
              </Stack>
            </Stack>

            <Box sx={railContainerSx}>
              {props.prospect && (
                <Paper
                  sx={{
                    p: 1.75,
                    borderRadius: 3,
                    bgcolor: '#422006',
                    color: '#fef3c7',
                    border: '2px solid #f59e0b',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Chip size='small' label='ACTIVE PROSPECT' sx={{ bgcolor: '#f59e0b', color: '#000', fontWeight: 900, mb: 1 }} />
                    <Typography variant='h6' sx={{ fontWeight: 900 }}>{props.prospect.card.name}</Typography>
                    <Typography variant='caption' sx={{ color: '#fde68a' }}>
                      Your personal Trade Good &amp; Scout shape this Year
                    </Typography>
                  </Box>
                  <Stack direction='row' sx={{ justifyContent: 'space-around', alignItems: 'center', mt: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24 }}><GoodsIcon /></Box>
                      <Typography variant='h6' sx={{ fontWeight: 900 }}>#{props.prospect.card.goods}</Typography>
                    </Stack>
                    <ScoutShapeBadge scout={props.prospect.card.scout} size={32} />
                  </Stack>
                </Paper>
              )}

              {props.playerDrawn.map((entry) => (
                <Paper
                  key={`c-player-${entry.id}`}
                  sx={{
                    p: 1.75,
                    borderRadius: 3,
                    bgcolor: '#fffbf4',
                    color: '#1e293b',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 1.25,
                  }}
                >
                  <Box>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 900 }}>{entry.card.name}</Typography>
                      <ResourcePipsRow resources={entry.card.resources} size={16} />
                    </Stack>
                    <Typography variant='caption' sx={{ color: '#475569', fontWeight: 700, display: 'block', mb: 0.75 }}>
                      {entry.card.objective}
                    </Typography>
                    <ScoreThresholdPills score={entry.card.score} />
                  </Box>

                  <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f1f5f9', px: 1.25, py: 0.75, borderRadius: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: 800 }}>Good #{entry.card.goods}</Typography>
                    <ScoutShapeBadge scout={entry.card.scout} size={26} />
                  </Stack>

                  <Stack direction='row' spacing={0.75}>
                    <Button
                      fullWidth
                      size='small'
                      variant='outlined'
                      disabled={props.objectiveCards.length >= 6}
                      onClick={() => props.onAddObjective(entry)}
                      sx={{ minHeight: 38, borderColor: '#c2442a', color: '#c2442a', fontWeight: 800 }}
                    >
                      As Path
                    </Button>
                    <Button
                      fullWidth
                      size='small'
                      variant='contained'
                      onClick={() => props.onAddResourceFromPlayer(entry)}
                      sx={{ minHeight: 38, bgcolor: '#c2442a', fontWeight: 800 }}
                    >
                      As Resource
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Paper>

          {/* RAIL 2: NEUTRAL OPPONENT CARDS */}
          <Paper sx={{ p: 2, borderRadius: 3.5, bgcolor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 900, color: '#38bdf8' }}>
                  Neutral Trade &amp; Scout Rail
                </Typography>
                <Chip
                  size='small'
                  label={`+${props.extraInvasionDraws} Extra Invasion`}
                  sx={{ bgcolor: '#7f1d1d', color: '#fecaca', fontWeight: 800 }}
                />
              </Stack>
              <Stack direction='row' spacing={1}>
                <Button
                  variant='contained'
                  disabled={!props.canDrawOpponent}
                  onClick={props.onDrawOpponent}
                  sx={{ bgcolor: '#0284c7', fontWeight: 800, minHeight: 40 }}
                >
                  + Draw Neutral ({props.opponentRemaining})
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onClearOpponent}
                  sx={{ color: '#cbd5e1', borderColor: '#475569', minHeight: 40 }}
                >
                  Clear Neutral
                </Button>
              </Stack>
            </Stack>

            <Box sx={railContainerSx}>
              {props.opponentDrawn.map(({ id, card }) => {
                const usage = props.neutralUses[id] || { resources: 0, soldiers: 0 };
                return (
                  <Paper
                    key={`c-opp-${id}`}
                    sx={{
                      p: 1.75,
                      borderRadius: 3,
                      bgcolor: '#fffbf4',
                      color: '#1e293b',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 1.25,
                    }}
                  >
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 900 }}>{card.name}</Typography>
                      <Chip
                        size='small'
                        label={`Used: ${usage.resources}G / ${usage.soldiers}S`}
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>

                    <Stack spacing={1}>
                      <Button
                        fullWidth
                        variant='contained'
                        disabled={props.resourceAmount.brick < 1}
                        onClick={() => props.onUseNeutral(id, 'brick')}
                        sx={{ minHeight: 44, bgcolor: '#57534e', justifyContent: 'space-between', fontWeight: 800 }}
                      >
                        <span>Good #{card.goods}</span>
                        <span>1 Brick <Inventory2Outlined sx={{ fontSize: 14 }} /></span>
                      </Button>
                      <Button
                        fullWidth
                        variant='contained'
                        disabled={props.resourceAmount.black < 1}
                        onClick={() => props.onUseNeutral(id, 'black')}
                        sx={{ minHeight: 44, bgcolor: '#1e293b', justifyContent: 'space-between', fontWeight: 800 }}
                      >
                        <span>Scout {card.scout}</span>
                        <span>1 Black <PersonOutlined sx={{ fontSize: 14 }} /></span>
                      </Button>
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          </Paper>

          {/* RAIL 3: FATE & INVASION */}
          <Paper sx={{ p: 2, borderRadius: 3.5, bgcolor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Stack direction='row' spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant='h6' sx={{ fontWeight: 900, color: '#f87171' }}>
                  Fate &amp; Invasion Rail
                </Typography>
                <Chip size='small' label={`L: ${props.pictDirectionCount.left}`} sx={{ bgcolor: '#991b1b', color: '#fff', fontWeight: 800 }} />
                <Chip size='small' label={`C: ${props.pictDirectionCount.center}`} sx={{ bgcolor: '#9a3412', color: '#fff', fontWeight: 800 }} />
                <Chip size='small' label={`R: ${props.pictDirectionCount.right}`} sx={{ bgcolor: '#3730a3', color: '#fff', fontWeight: 800 }} />
              </Stack>
              <Stack direction='row' spacing={1}>
                <Button
                  variant='contained'
                  disabled={!props.canDrawFate}
                  onClick={props.onDrawFate}
                  sx={{ bgcolor: '#c2442a', fontWeight: 800, minHeight: 40 }}
                >
                  + Draw Fate ({props.fateRemaining})
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onSortFate}
                  sx={{ color: '#cbd5e1', borderColor: '#475569', minHeight: 40 }}
                >
                  Sort
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onClearFate}
                  sx={{ color: '#fca5a5', borderColor: '#ef4444', minHeight: 40 }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>

            <Box sx={railContainerSx}>
              {props.fateDrawn.map((entry) => (
                <Paper
                  key={`c-fate-${entry.id}`}
                  sx={{
                    p: 1.75,
                    borderRadius: 3,
                    bgcolor: '#fffbf4',
                    color: '#1e293b',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 1.25,
                  }}
                >
                  <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <PictDirectionBadge direction={entry.card.picts_direction} />
                    <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 20, height: 20 }}><GladiatorIcon /></Box>
                      <Typography sx={{ fontWeight: 800 }}>{entry.card.gladiator}</Typography>
                      <Box sx={{ width: 20, height: 20 }}><GoodsIcon /></Box>
                      <Typography sx={{ fontWeight: 800 }}>#{entry.card.goods}</Typography>
                    </Stack>
                  </Stack>

                  <ResourcePipsRow resources={entry.card.resource} size={16} />

                  <Stack direction='row' spacing={0.75}>
                    <Button
                      fullWidth
                      size='small'
                      variant='contained'
                      onClick={() => props.onAddResourceFromFate(entry)}
                      sx={{ minHeight: 38, bgcolor: '#c2442a', fontWeight: 800 }}
                    >
                      As Resource
                    </Button>
                    <Button
                      fullWidth
                      size='small'
                      variant='outlined'
                      onClick={() => props.onDiscardFate(entry.id)}
                      sx={{ minHeight: 38, borderColor: '#64748b', color: '#475569', fontWeight: 700 }}
                    >
                      Discard
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};
