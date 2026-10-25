/**
 * THROWAWAY PROTOTYPE — Variant D: Compact Accordion Stack + Expandable Bottom Resource Tray
 */
import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Collapse,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
  ExpandLess,
  ExpandMore,
  Inventory2Outlined,
  PersonOutlined,
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

export const VariantDCompactAccordionSheet: React.FC<PrototypeAppProps> = (props) => {
  const [trayExpanded, setTrayExpanded] = useState<boolean>(false);
  const totalResources = RESOURCE_KEYS.reduce((sum, key) => sum + props.resourceAmount[key], 0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: trayExpanded ? '260px' : '150px',
        bgcolor: '#efe6d5',
      }}
    >
      {/* Ultra-compact Top Bar */}
      <Paper
        elevation={1}
        sx={{
          px: 2,
          py: 1,
          bgcolor: '#c2442a',
          color: '#fff',
          borderRadius: 0,
        }}
      >
        <Stack
          direction='row'
          sx={{ maxWidth: 880, mx: 'auto', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant='subtitle1' sx={{ fontWeight: 900 }}>
            Hadrian&apos;s Wall · Compact Sheet
          </Typography>
          <Stack direction='row' spacing={1}>
            <Button
              size='small'
              variant='outlined'
              startIcon={<AutoAwesome />}
              onClick={props.onLoadDemoMidYear}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}
            >
              Demo State
            </Button>
            <Button
              size='small'
              variant='contained'
              onClick={props.onOpenNewGame}
              sx={{ bgcolor: '#1e293b', color: '#fff', fontSize: '0.72rem' }}
            >
              New Game
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Main Accordion Stack */}
      <Stack sx={{ maxWidth: 880, mx: 'auto', p: 1.5 }} spacing={1.25}>
        {/* ACCORDION 1: ROUND & PATHS SUMMARY */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#fffbf4' }}>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center', width: '100%', pr: 1, justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 800, color: '#c2442a' }}>
                Paths ({props.objectiveCards.length}/6) &amp; Invasion Threat
              </Typography>
              <Chip
                size='small'
                label={props.prospect ? `Prospect: ${props.prospect.card.name} (#${props.prospect.card.goods} / ${props.prospect.card.scout})` : 'No Prospect'}
                color={props.prospect ? 'warning' : 'default'}
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fff', pt: 1 }}>
            {/* Compact 1-line Round Reference Strip */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 0.5,
                mb: 1.5,
                textAlign: 'center',
              }}
            >
              {props.rounds.map((r) => (
                <Box key={r.round} sx={{ p: 0.5, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#c2442a' }}>R{r.round}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#15803d' }}>E:{r.easy} M:{r.medium}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#b91c1c' }}>H:{r.hard} V:{r.valour}</Typography>
                </Box>
              ))}
            </Box>

            {/* Compact Path Rows */}
            <Stack spacing={0.75}>
              {props.objectiveCards.map(({ id, card }) => (
                <Stack
                  key={`d-path-${id}`}
                  direction='row'
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 0.85,
                    borderRadius: 1.5,
                    bgcolor: '#fffbf4',
                    border: '1px solid #e7e5e4',
                    flexWrap: 'wrap',
                    gap: 0.5,
                  }}
                >
                  <Box>
                    <Typography component='span' sx={{ fontWeight: 800, color: '#c2442a', mr: 1 }}>
                      {card.name}
                    </Typography>
                    <Typography component='span' variant='body2' sx={{ color: '#44403c' }}>
                      {card.objective}
                    </Typography>
                  </Box>
                  <ScoreThresholdPills score={card.score} />
                </Stack>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* ACCORDION 2: PLAYER CARDS */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#fffbf4' }}>
            <Stack direction='row' sx={{ width: '100%', pr: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: '#c2442a' }}>
                Player Deck ({props.playerDrawn.length} drawn · {props.playerRemaining} left)
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fff' }}>
            <Stack direction='row' spacing={1} sx={{ mb: 1.25 }}>
              <Button
                fullWidth
                variant='contained'
                disabled={!props.canDrawPlayer}
                onClick={props.onDrawPlayer}
                sx={{ bgcolor: '#c2442a', fontWeight: 800, minHeight: 42 }}
              >
                Draw Player Card
              </Button>
              <Button variant='outlined' onClick={props.onClearPlayer} sx={{ minHeight: 42 }}>
                Clear
              </Button>
            </Stack>

            <Stack spacing={1}>
              {props.playerDrawn.map((entry) => (
                <Paper
                  key={`d-player-${entry.id}`}
                  variant='outlined'
                  sx={{ p: 1.25, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}
                >
                  <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {entry.card.name} <Typography component='span' variant='body2' color='text.secondary'>· {entry.card.objective}</Typography>
                    </Typography>
                    <ResourcePipsRow resources={entry.card.resources} size={16} />
                  </Stack>
                  <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <ScoreThresholdPills score={entry.card.score} />
                    <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                      <Chip size='small' label={`Good #${entry.card.goods}`} />
                      <ScoutShapeBadge scout={entry.card.scout} size={22} />
                    </Stack>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Button
                      fullWidth
                      size='small'
                      variant='outlined'
                      disabled={props.objectiveCards.length >= 6}
                      onClick={() => props.onAddObjective(entry)}
                    >
                      As Path
                    </Button>
                    <Button
                      fullWidth
                      size='small'
                      variant='contained'
                      onClick={() => props.onAddResourceFromPlayer(entry)}
                      sx={{ bgcolor: '#c2442a' }}
                    >
                      As Resource
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* ACCORDION 3: NEUTRAL CARDS */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#fffbf4' }}>
            <Stack direction='row' sx={{ width: '100%', pr: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: '#c2442a' }}>
                Neutral Cards ({props.opponentDrawn.length} drawn)
              </Typography>
              <Chip
                size='small'
                label={`+${props.extraInvasionDraws} Extra Invasion`}
                color={props.extraInvasionDraws > 0 ? 'error' : 'default'}
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fff' }}>
            <Stack direction='row' spacing={1} sx={{ mb: 1.25 }}>
              <Button
                fullWidth
                variant='contained'
                disabled={!props.canDrawOpponent}
                onClick={props.onDrawOpponent}
                sx={{ bgcolor: '#c2442a', fontWeight: 800, minHeight: 42 }}
              >
                Draw Neutral Card ({props.opponentRemaining})
              </Button>
              <Button variant='outlined' onClick={props.onClearOpponent} sx={{ minHeight: 42 }}>
                Clear
              </Button>
            </Stack>

            <Stack spacing={1}>
              {props.opponentDrawn.map(({ id, card }) => {
                const usage = props.neutralUses[id] || { resources: 0, soldiers: 0 };
                return (
                  <Paper key={`d-opp-${id}`} variant='outlined' sx={{ p: 1.25, borderRadius: 2 }}>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 800, minWidth: 90 }}>{card.name}</Typography>
                      <Stack direction='row' spacing={1} sx={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size='small'
                          variant='contained'
                          disabled={props.resourceAmount.brick < 1}
                          onClick={() => props.onUseNeutral(id, 'brick')}
                          sx={{ bgcolor: '#57534e', minHeight: 38 }}
                        >
                          Good #{card.goods} ({usage.resources}) <Inventory2Outlined sx={{ fontSize: 14, ml: 0.5 }} />
                        </Button>
                        <Button
                          size='small'
                          variant='contained'
                          disabled={props.resourceAmount.black < 1}
                          onClick={() => props.onUseNeutral(id, 'black')}
                          sx={{ bgcolor: '#1e293b', minHeight: 38 }}
                        >
                          Scout {card.scout} ({usage.soldiers}) <PersonOutlined sx={{ fontSize: 14, ml: 0.5 }} />
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* ACCORDION 4: FATE & INVASION */}
        <Accordion defaultExpanded sx={{ borderRadius: '12px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#fffbf4' }}>
            <Stack direction='row' sx={{ width: '100%', pr: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: '#c2442a' }}>
                Fate &amp; Invasion ({props.fateDrawn.length} revealed)
              </Typography>
              <Stack direction='row' spacing={0.5}>
                <Chip size='small' label={`L:${props.pictDirectionCount.left}`} />
                <Chip size='small' label={`C:${props.pictDirectionCount.center}`} />
                <Chip size='small' label={`R:${props.pictDirectionCount.right}`} />
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#fff' }}>
            <Stack direction='row' spacing={1} sx={{ mb: 1.25 }}>
              <Button
                fullWidth
                variant='contained'
                disabled={!props.canDrawFate}
                onClick={props.onDrawFate}
                sx={{ bgcolor: '#c2442a', fontWeight: 800, minHeight: 42 }}
              >
                Draw Fate Card ({props.fateRemaining})
              </Button>
              <Button variant='outlined' onClick={props.onSortFate} sx={{ minHeight: 42 }}>
                Sort
              </Button>
              <Button variant='outlined' color='error' onClick={props.onClearFate} sx={{ minHeight: 42 }}>
                Clear
              </Button>
            </Stack>

            <Stack spacing={1}>
              {props.fateDrawn.map((entry) => (
                <Paper key={`d-fate-${entry.id}`} variant='outlined' sx={{ p: 1.25, borderRadius: 2 }}>
                  <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <PictDirectionBadge direction={entry.card.picts_direction} size={24} />
                    <ResourcePipsRow resources={entry.card.resource} size={15} />
                    <Stack direction='row' spacing={0.75}>
                      <Button
                        size='small'
                        variant='contained'
                        onClick={() => props.onAddResourceFromFate(entry)}
                        sx={{ bgcolor: '#c2442a' }}
                      >
                        Collect
                      </Button>
                      <Button
                        size='small'
                        variant='outlined'
                        onClick={() => props.onDiscardFate(entry.id)}
                      >
                        Discard
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>

      {/* Expandable Bottom Sheet Resource Drawer (Pinned above Prototype Switcher) */}
      <Paper
        elevation={12}
        sx={{
          position: 'fixed',
          bottom: 58,
          left: 0,
          right: 0,
          zIndex: 35,
          bgcolor: '#1c1917',
          color: '#fff',
          borderRadius: '18px 18px 0 0',
          borderTop: '2px solid #c2442a',
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ maxWidth: 880, mx: 'auto' }}>
          <Stack
            direction='row'
            onClick={() => setTrayExpanded((v) => !v)}
            sx={{ justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', pb: trayExpanded ? 1 : 0 }}
          >
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 900, color: '#fbbf24' }}>
                RESOURCES ({totalResources})
              </Typography>
              {RESOURCE_KEYS.map((key) => (
                <Chip
                  key={key}
                  size='small'
                  label={`${RESOURCE_META[key].short}: ${props.resourceAmount[key]}`}
                  sx={{
                    bgcolor: RESOURCE_META[key].bg,
                    color: RESOURCE_META[key].fg,
                    fontWeight: 800,
                    height: 22,
                    fontSize: '0.72rem',
                  }}
                />
              ))}
            </Stack>
            <Button
              size='small'
              endIcon={trayExpanded ? <ExpandMore /> : <ExpandLess />}
              sx={{ color: '#fbbf24', textTransform: 'none', fontWeight: 800 }}
            >
              {trayExpanded ? 'Hide Tray' : 'Adjust'}
            </Button>
          </Stack>

          <Collapse in={trayExpanded}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: 1,
                pt: 1,
              }}
            >
              {RESOURCE_KEYS.map((key) => {
                const meta = RESOURCE_META[key];
                const val = props.resourceAmount[key];
                return (
                  <Box
                    key={key}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, mb: 0.5 }}>{meta.label}</Typography>
                    <Stack direction='row' sx={{ justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
                      <Button
                        size='small'
                        variant='outlined'
                        onClick={() => val > 0 && props.onChangeResource(key, val - 1)}
                        sx={{ minWidth: 28, height: 30, p: 0, color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                      >
                        −
                      </Button>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', minWidth: 20 }}>{val}</Typography>
                      <Button
                        size='small'
                        variant='contained'
                        onClick={() => props.onChangeResource(key, val + 1)}
                        sx={{ minWidth: 28, height: 30, p: 0, bgcolor: meta.bg, color: meta.fg }}
                      >
                        +
                      </Button>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>
      </Paper>
    </Box>
  );
};
