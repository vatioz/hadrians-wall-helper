import { PlayerCard } from './playerCards.model';

const opponentCards: PlayerCard[] = [
  {
    name: 'Fighter',
    objective: 'Completed Cohorts',
    score: {
      1: 1,
      2: 2,
      3: 3,
    },
    resources: ['black'],
    goods: '5',
    scout: 'Square',
  },
  {
    name: 'Engineer',
    objective: 'Large Buildings',
    score: {
      2: 1,
      4: 2,
      6: 3,
    },
    resources: ['blue', 'brick'],
    goods: '2',
    scout: 'L',
  },
  {
    name: 'Planner',
    objective: 'Completed Citizen Tracks',
    score: {
      2: 1,
      4: 2,
      5: 3,
    },
    resources: ['purple', 'yellow'],
    goods: '1',
    scout: 'S',
  },
  {
    name: 'Trainer',
    objective: 'Total Gladiator Strength',
    score: {
      4: 1,
      8: 2,
      12: 3,
    },
    resources: ['purple', 'brick'],
    goods: '4',
    scout: 'S',
  },
  {
    name: 'Vanguard',
    objective: 'Completed Wall Guard Sections',
    score: {
      1: 1,
      2: 2,
      3: 3,
    },
    resources: ['blue', 'yellow'],
    goods: '2',
    scout: 'S',
  },
  {
    name: 'Ranger',
    objective: 'Completed Scout Columns',
    score: {
      1: 1,
      3: 2,
      4: 3,
    },
    resources: ['black'],
    goods: '6',
    scout: 'Line',
  },
  {
    name: 'Forager',
    objective: 'Resource Production',
    score: {
      3: 1,
      6: 2,
      9: 3,
    },
    resources: ['purple', 'brick'],
    goods: '3',
    scout: 'T',
  },
  {
    name: 'Pontiff',
    objective: 'Filled Temples',
    score: {
      1: 1,
      2: 2,
      3: 3,
    },
    resources: ['purple', 'purple'],
    goods: '2',
    scout: 'T',
  },
  {
    name: 'Merchant',
    objective: 'Collected Goods',
    score: {
      4: 1,
      6: 2,
      8: 3,
    },
    resources: ['yellow', 'brick'],
    goods: '4',
    scout: 'Square',
  },
  {
    name: 'Aristocrat',
    objective: 'Final Disdain',
    score: {
      4: 1,
      2: 2,
      0: 3,
    },
    resources: ['yellow', 'blue'],
    goods: '1',
    scout: 'T',
  },
  {
    name: 'Defender',
    objective: 'Completed Wall Sections',
    score: {
      1: 1,
      2: 2,
      3: 3,
    },
    resources: ['brick', 'blue'],
    goods: '1',
    scout: 'L',
  },
  {
    name: 'Architect',
    objective: 'Constructed Landmarks',
    score: {
      1: 1,
      2: 2,
      3: 3,
    },
    resources: ['brick', 'brick'],
    goods: '2',
    scout: 'Line',
  },
];

export default opponentCards;
