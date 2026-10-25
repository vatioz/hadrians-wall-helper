/**
 * THROWAWAY PROTOTYPE — Variant A: Bottom-Tab Phase Workspace (Mobile-Native App Shell)
 */
import React, { useState } from 'react';
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
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
  EmojiEvents,
  Groups,
  Inventory2Outlined,
  PersonOutlined,
  Shield,
  Style,
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

type TabKey = 'player' | 'neutral' | 'invasion' | 'paths';

export const VariantABottomTabWorkspace: React.FC<PrototypeAppProps> = (props) => {
  const [activeTab, setActiveTab] = useState<TabKey>('player');
  const [selectedYear, setSelectedYear] = useState<number>(1);

  const currentRound = props.rounds.find((r) => r.round === selectedYear) ?? props.rounds[0];
  const totalInvasionCards = props.fateDrawn.length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: '148px',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 18%, #e8dcc8 18%, #f3eadb 100%)',
      }}
    >
      {/* Sticky Top App Header + Tactile Resource Bar */}
      <Paper
        elevation={4}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          borderRadius: '0 0 20px 20px',
          bgcolor: '#172030',
          color: '#f8fafc',
          px: { xs: 1.5, sm: 2.5 },
          pt: 1.25,
          pb: 1.5,
          borderBottom: '2px solid #c2442a',
        }}
      >
        <Stack sx={{ maxWidth: 960, mx: 'auto' }} spacing={1.25}>
          {/* Top bar: Title + Year quick status + Demo/Reset */}
          <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#f59e0b', letterSpacing: 0.4 }}>
                HADRIAN&apos;S WALL
              </Typography>
              <Chip
                size='small'
                label={`Year ${selectedYear}/6`}
                onClick={() => setActiveTab('paths')}
                sx={{
                  bgcolor: '#c2442a',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              />
              {props.extraInvasionDraws > 0 && (
                <Chip
                  size='small'
                  label={`+${props.extraInvasionDraws} Neutral Draws`}
                  sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 700 }}
                />
              )}
            </Stack>

            <Stack direction='row' spacing={1}>
              <Button
                size='small'
                variant='outlined'
                onClick={props.onResetResources}
                sx={{
                  color: '#cbd5e1',
                  borderColor: 'rgba(203,213,225,0.35)',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  minHeight: 34,
                }}
              >
                Zero Pool
              </Button>
              <Button
                size='small'
                variant='contained'
                onClick={props.onOpenNewGame}
                sx={{
                  bgcolor: '#c2442a',
                  '&:hover': { bgcolor: '#d34f34' },
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  minHeight: 34,
                }}
              >
                New Game
              </Button>
            </Stack>
          </Stack>

          {/* 5-column Tactile Resource Strip */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: { xs: 0.75, sm: 1.25 },
            }}
          >
            {RESOURCE_KEYS.map((key) => {
              const meta = RESOURCE_META[key];
              const count = props.resourceAmount[key];
              return (
                <Box
                  key={key}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.07)',
                    borderRadius: 2.5,
                    p: { xs: 0.6, sm: 0.85 },
                    border: `1.5px solid ${meta.bg}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: meta.bg,
                        border: '1px solid rgba(255,255,255,0.6)',
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: { xs: '0.68rem', sm: '0.78rem' },
                        fontWeight: 700,
                        color: '#e2e8f0',
                        lineHeight: 1,
                      }}
                    >
                      {meta.label}
                    </Typography>
                  </Stack>

                  <Stack
                    direction='row'
                     sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Button
                      aria-label={`Decrease ${meta.label}`}
                      onClick={() => count > 0 && props.onChangeResource(key, count - 1)}
                      disabled={count <= 0}
                      sx={{
                        minWidth: { xs: 28, sm: 36 },
                        height: { xs: 30, sm: 34 },
                        p: 0,
                        borderRadius: 1.5,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '1rem',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                      }}
                    >
                      −
                    </Button>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '1.05rem', sm: '1.25rem' },
                        color: '#fff',
                        mx: 0.25,
                      }}
                    >
                      {count}
                    </Typography>
                    <Button
                      aria-label={`Increase ${meta.label}`}
                      onClick={() => props.onChangeResource(key, count + 1)}
                      sx={{
                        minWidth: { xs: 28, sm: 36 },
                        height: { xs: 30, sm: 34 },
                        p: 0,
                        borderRadius: 1.5,
                        bgcolor: meta.bg,
                        color: meta.fg,
                        fontWeight: 800,
                        fontSize: '1rem',
                        '&:hover': { opacity: 0.9, bgcolor: meta.bg },
                      }}
                    >
                      +
                    </Button>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Stack>
      </Paper>

      {/* Main Single-Phase Viewport */}
      <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 1.5, sm: 2.5 }, pt: 2 }}>
        {/* TAB 1: PLAYER CARDS & PROSPECT */}
        {activeTab === 'player' && (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fffbf4', border: '1px solid #d6c7b2' }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a' }}>
                    Player Deck &amp; Prospect
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#57534e' }}>
                    Draw 2 cards per Year: pick 1 as Path ({props.objectiveCards.length}/6) and 1 as Resource/Prospect.
                  </Typography>
                </Box>
                <Chip
                  label={`Deck: ${props.playerRemaining}/${props.playerTotal}`}
                  sx={{ fontWeight: 700, bgcolor: '#f5ebe0' }}
                />
              </Stack>

              <Stack direction='row' spacing={1.25} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  disabled={!props.canDrawPlayer}
                  onClick={props.onDrawPlayer}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2.5,
                    bgcolor: '#c2442a',
                    fontWeight: 800,
                    '&:hover': { bgcolor: '#d34f34' },
                  }}
                >
                  Draw Player Card ({props.playerRemaining})
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onClearPlayer}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2.5,
                    borderColor: '#c2442a',
                    color: '#c2442a',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    px: 2,
                  }}
                >
                  Next Year Clear
                </Button>
              </Stack>
            </Paper>

            {props.prospect && (
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#fef3c7',
                  border: '2px solid #d97706',
                }}
              >
                <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip size='small' label='ACTIVE PROSPECT (YEAR TRADE & SCOUT)' sx={{ bgcolor: '#d97706', color: '#fff', fontWeight: 800 }} />
                  <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#78350f' }}>
                    {props.prospect.card.name}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-around', py: 0.5 }}>
                  <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                    <Box sx={{ width: 28, height: 28 }}><GoodsIcon /></Box>
                    <Typography variant='h6' sx={{ fontWeight: 800 }}>Good #{props.prospect.card.goods}</Typography>
                  </Stack>
                  <Divider orientation='vertical' flexItem />
                  <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                    <Box sx={{ width: 28, height: 28 }}><HorseIcon /></Box>
                    <ScoutShapeBadge scout={props.prospect.card.scout} size={36} />
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{props.prospect.card.scout}</Typography>
                  </Stack>
                </Stack>
              </Paper>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              {props.playerDrawn.map((entry) => (
                <Paper
                  key={`a-player-${entry.id}`}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant='h6' sx={{ fontWeight: 800, color: '#1e293b' }}>
                        {entry.card.name}
                      </Typography>
                      <ResourcePipsRow resources={entry.card.resources} size={20} />
                    </Stack>
                    <Typography variant='body2' sx={{ color: '#475569', fontWeight: 600, mb: 1 }}>
                      {entry.card.objective}
                    </Typography>
                    <ScoreThresholdPills score={entry.card.score} />
                  </Box>

                  <Stack
                    direction='row'
                    sx={{
                      bgcolor: '#f8fafc',
                      p: 1,
                      borderRadius: 2,
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 22, height: 22 }}><GoodsIcon /></Box>
                      <Typography sx={{ fontWeight: 800 }}>#{entry.card.goods}</Typography>
                    </Stack>
                    <Divider orientation='vertical' flexItem />
                    <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 22, height: 22 }}><HorseIcon /></Box>
                      <ScoutShapeBadge scout={entry.card.scout} size={28} />
                    </Stack>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <Button
                      fullWidth
                      variant='outlined'
                      disabled={props.objectiveCards.length >= 6}
                      onClick={() => props.onAddObjective(entry)}
                      sx={{
                        minHeight: 44,
                        borderRadius: 2,
                        fontWeight: 800,
                        borderColor: '#c2442a',
                        color: '#c2442a',
                      }}
                    >
                      As Path ({props.objectiveCards.length}/6)
                    </Button>
                    <Button
                      fullWidth
                      variant='contained'
                      onClick={() => props.onAddResourceFromPlayer(entry)}
                      sx={{
                        minHeight: 44,
                        borderRadius: 2,
                        fontWeight: 800,
                        bgcolor: '#c2442a',
                        '&:hover': { bgcolor: '#d34f34' },
                      }}
                    >
                      As Resource
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Stack>
        )}

        {/* TAB 2: NEUTRAL OPPONENT CARDS */}
        {activeTab === 'neutral' && (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fffbf4', border: '1px solid #d6c7b2' }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a' }}>
                    Neutral Cards (Trade &amp; Scout)
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#57534e' }}>
                    Spend Brick (Resource) to Buy Goods or Black (Soldier) to Scout. Each use adds +1 Invasion Draw.
                  </Typography>
                </Box>
                <Stack direction='row' spacing={1}>
                  <Chip
                    label={`Deck: ${props.opponentRemaining}/${props.opponentTotal}`}
                    sx={{ fontWeight: 700, bgcolor: '#f5ebe0' }}
                  />
                  <Chip
                    label={`Extra Draws: +${props.extraInvasionDraws}`}
                    sx={{ fontWeight: 800, bgcolor: '#fee2e2', color: '#991b1b' }}
                  />
                </Stack>
              </Stack>

              <Stack direction='row' spacing={1.25} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  disabled={!props.canDrawOpponent}
                  onClick={props.onDrawOpponent}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2.5,
                    bgcolor: '#c2442a',
                    fontWeight: 800,
                  }}
                >
                  Draw Neutral Card ({props.opponentRemaining})
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onClearOpponent}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2.5,
                    borderColor: '#c2442a',
                    color: '#c2442a',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    px: 2,
                  }}
                >
                  Clear Neutral
                </Button>
              </Stack>
            </Paper>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              {props.opponentDrawn.map(({ id, card }) => {
                const usage = props.neutralUses[id] || { resources: 0, soldiers: 0 };
                return (
                  <Paper
                    key={`a-opp-${id}`}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                    }}
                  >
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant='h6' sx={{ fontWeight: 800 }}>
                        {card.name}
                      </Typography>
                      <Stack direction='row' spacing={0.75}>
                        <Chip
                          size='small'
                          label={`Goods used: ${usage.resources}`}
                          sx={{ bgcolor: '#f1f5f9', fontWeight: 700 }}
                        />
                        <Chip
                          size='small'
                          label={`Scouts used: ${usage.soldiers}`}
                          sx={{ bgcolor: '#f1f5f9', fontWeight: 700 }}
                        />
                      </Stack>
                    </Stack>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1.25,
                      }}
                    >
                      <Button
                        variant='contained'
                        disabled={props.resourceAmount.brick < 1}
                        onClick={() => props.onUseNeutral(id, 'brick')}
                        sx={{
                          minHeight: 58,
                          borderRadius: 2.5,
                          bgcolor: '#57534e',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.25,
                          textTransform: 'none',
                        }}
                      >
                        <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center' }}>
                          <Box sx={{ width: 20, height: 20 }}><GoodsIcon /></Box>
                          <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>
                            Buy Good #{card.goods}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '0.72rem', opacity: 0.9 }}>
                          Spend 1 Brick (<Inventory2Outlined sx={{ fontSize: 12, verticalAlign: 'middle' }} />)
                        </Typography>
                      </Button>

                      <Button
                        variant='contained'
                        disabled={props.resourceAmount.black < 1}
                        onClick={() => props.onUseNeutral(id, 'black')}
                        sx={{
                          minHeight: 58,
                          borderRadius: 2.5,
                          bgcolor: '#1e293b',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.25,
                          textTransform: 'none',
                        }}
                      >
                        <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center' }}>
                          <ScoutShapeBadge scout={card.scout} size={22} />
                          <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>
                            Scout {card.scout}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '0.72rem', opacity: 0.9 }}>
                          Spend 1 Black (<PersonOutlined sx={{ fontSize: 12, verticalAlign: 'middle' }} />)
                        </Typography>
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Stack>
        )}

        {/* TAB 3: FATE & INVASION */}
        {activeTab === 'invasion' && (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fffbf4', border: '1px solid #d6c7b2' }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a' }}>
                    Fate Deck &amp; Pict Invasion
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#57534e' }}>
                    Year {selectedYear} Base Draws: Easy {currentRound.easy} · Med {currentRound.medium} · Hard {currentRound.hard} (+{props.extraInvasionDraws} Neutral)
                  </Typography>
                </Box>
                <Chip
                  label={`Deck: ${props.fateRemaining}/${props.fateTotal}`}
                  sx={{ fontWeight: 700, bgcolor: '#f5ebe0' }}
                />
              </Stack>

              {/* Attack Direction Tally Banner */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                  my: 2,
                }}
              >
                {(['left', 'center', 'right'] as const).map((dir) => (
                  <Paper
                    key={dir}
                    elevation={0}
                    sx={{
                      p: 1.25,
                      borderRadius: 2.5,
                      textAlign: 'center',
                      bgcolor: '#fff',
                      border: '2px solid #e2e8f0',
                    }}
                  >
                    <Typography variant='caption' sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                      {dir} flank
                    </Typography>
                    <Typography variant='h4' sx={{ fontWeight: 900, color: '#c2442a' }}>
                      {props.pictDirectionCount[dir]}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Button
                  variant='contained'
                  size='large'
                  disabled={!props.canDrawFate}
                  onClick={props.onDrawFate}
                  sx={{
                    flex: 2,
                    minHeight: 48,
                    borderRadius: 2.5,
                    bgcolor: '#c2442a',
                    fontWeight: 800,
                  }}
                >
                  Draw Fate Card
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onSortFate}
                  sx={{
                    flex: 1,
                    minHeight: 48,
                    borderRadius: 2.5,
                    borderColor: '#475569',
                    color: '#334155',
                    fontWeight: 700,
                  }}
                >
                  Sort Arrows
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onClearFate}
                  sx={{
                    flex: 1,
                    minHeight: 48,
                    borderRadius: 2.5,
                    borderColor: '#c2442a',
                    color: '#c2442a',
                    fontWeight: 700,
                  }}
                >
                  Clear Invasion
                </Button>
              </Stack>
            </Paper>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              {props.fateDrawn.map((entry) => (
                <Paper
                  key={`a-fate-${entry.id}`}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.25,
                  }}
                >
                  <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <PictDirectionBadge direction={entry.card.picts_direction} />
                    <Stack direction='row' spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Box sx={{ width: 22, height: 22 }}><GladiatorIcon /></Box>
                        <Typography sx={{ fontWeight: 800 }}>{entry.card.gladiator}</Typography>
                      </Stack>
                      <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Box sx={{ width: 22, height: 22 }}><GoodsIcon /></Box>
                        <Typography sx={{ fontWeight: 800 }}>#{entry.card.goods}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <ResourcePipsRow resources={entry.card.resource} size={20} />

                  <Stack direction='row' spacing={1}>
                    <Button
                      fullWidth
                      variant='contained'
                      onClick={() => props.onAddResourceFromFate(entry)}
                      sx={{
                        minHeight: 42,
                        borderRadius: 2,
                        bgcolor: '#c2442a',
                        fontWeight: 700,
                      }}
                    >
                      Collect Resources
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() => props.onDiscardFate(entry.id)}
                      sx={{
                        minHeight: 42,
                        borderRadius: 2,
                        borderColor: '#64748b',
                        color: '#475569',
                        fontWeight: 700,
                      }}
                    >
                      Discard
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Stack>
        )}

        {/* TAB 4: PATHS & ROUND TRACK */}
        {activeTab === 'paths' && (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fffbf4', border: '1px solid #d6c7b2' }}>
              <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a', mb: 1.5 }}>
                Active Year &amp; Invasion Reference
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
                  gap: 1,
                }}
              >
                {props.rounds.map((r) => {
                  const active = r.round === selectedYear;
                  return (
                    <Paper
                      key={r.round}
                      onClick={() => setSelectedYear(r.round)}
                      sx={{
                        p: 1.25,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        bgcolor: active ? '#1e293b' : '#ffffff',
                        color: active ? '#fff' : '#1e293b',
                        border: active ? '2px solid #c2442a' : '1px solid #cbd5e1',
                      }}
                    >
                      <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 0.5 }}>
                        Year {r.round}
                      </Typography>
                      <Stack spacing={0.25} sx={{ fontSize: '0.78rem' }}>
                        <Stack direction='row' sx={{ justifyContent: 'space-between', color: active ? '#86efac' : 'green' }}>
                          <span>Easy</span><strong>{r.easy}</strong>
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent: 'space-between', color: active ? '#fdba74' : 'orange' }}>
                          <span>Med</span><strong>{r.medium}</strong>
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent: 'space-between', color: active ? '#fca5a5' : 'red' }}>
                          <span>Hard</span><strong>{r.hard}</strong>
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent: 'space-between', opacity: 0.8 }}>
                          <span>Valour</span><strong>{r.valour}</strong>
                        </Stack>
                      </Stack>
                    </Paper>
                  );
                })}
              </Box>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#fffbf4', border: '1px solid #d6c7b2' }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant='h6' sx={{ fontWeight: 800, color: '#c2442a' }}>
                  Retained Paths ({props.objectiveCards.length}/6)
                </Typography>
                {props.objectiveCards.length === 0 && (
                  <Button size='small' startIcon={<AutoAwesome />} onClick={props.onLoadDemoMidYear}>
                    Load Demo Cards
                  </Button>
                )}
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 1.25,
                }}
              >
                {props.objectiveCards.map(({ id, card }, idx) => (
                  <Paper
                    key={`a-path-${id}`}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: '#fff',
                      border: '1.5px solid #cbd5e1',
                    }}
                  >
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 800, color: '#c2442a' }}>
                        {card.name}
                      </Typography>
                      <Chip size='small' label={`Year ${idx + 1}`} sx={{ height: 20, fontSize: '0.7rem' }} />
                    </Stack>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
                      {card.objective}
                    </Typography>
                    <ScoreThresholdPills score={card.score} />
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Stack>
        )}
      </Box>

      {/* Fixed Bottom App Navigation Bar (above the Prototype Switcher) */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 58,
          left: 0,
          right: 0,
          zIndex: 30,
          borderTop: '1px solid #cbd5e1',
        }}
      >
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(_, next) => setActiveTab(next)}
          sx={{
            maxWidth: 960,
            mx: 'auto',
            height: 64,
            bgcolor: '#ffffff',
            '& .Mui-selected': { color: '#c2442a !important', fontWeight: 800 },
          }}
        >
          <BottomNavigationAction
            value='player'
            label='Player Deck'
            icon={
              <Badge badgeContent={props.playerDrawn.length} color='primary'>
                <Style />
              </Badge>
            }
          />
          <BottomNavigationAction
            value='neutral'
            label='Neutral AI'
            icon={
              <Badge badgeContent={props.opponentDrawn.length} color='secondary'>
                <Groups />
              </Badge>
            }
          />
          <BottomNavigationAction
            value='invasion'
            label='Invasion'
            icon={
              <Badge badgeContent={totalInvasionCards} color='error'>
                <Shield />
              </Badge>
            }
          />
          <BottomNavigationAction
            value='paths'
            label='Paths & Years'
            icon={
              <Badge badgeContent={`${props.objectiveCards.length}/6`} color='warning'>
                <EmojiEvents />
              </Badge>
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
