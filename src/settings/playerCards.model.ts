export interface PlayerCard {
  name: string;
  objective: string;
  score: {
    [key: number]: number;
  };
  resources: Array<'black' | 'blue' | 'purple' | 'yellow' | 'brick'>;
  goods: string;
  scout: 'Line' | 'Square' | 'T' | 'L' | 'S';
}
