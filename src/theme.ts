import { createTheme, type Palette } from '@mui/material/styles';

export type ResourceName = 'black' | 'blue' | 'purple' | 'yellow' | 'brick';

export interface AppPalette {
  brand: string;
  brandHover: string;
  onBrand: string;
  brandLinkHover: string;
  sky: string;
  sand: string;
  paper: string;
  surface: string;
  ink: string;
  outline: string;
  danger: string;
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
    valour: string;
  };
  resource: Record<ResourceName, string>;
}

export const appPalette: AppPalette = {
  brand: '#c2442a',
  brandHover: '#d34f34',
  onBrand: '#fff',
  brandLinkHover: 'rgba(194, 68, 42, 0.7)',
  sky: '#89cff0',
  sand: '#e3c8a4',
  paper: 'white',
  surface: 'rgba(255, 255, 255, 0.4)',
  ink: 'black',
  outline: 'grey',
  danger: '#f04438',
  difficulty: {
    easy: 'green',
    medium: 'orange',
    hard: 'red',
    valour: 'grey',
  },
  resource: {
    black: 'black',
    blue: 'blue',
    purple: 'purple',
    yellow: 'yellow',
    brick: 'grey',
  },
};

declare module '@mui/material/styles' {
  interface Palette {
    app: AppPalette;
  }
  interface PaletteOptions {
    app?: AppPalette;
  }
}

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: Palette;
  }
}

export const muiTheme = createTheme({
  typography: {
    fontFamily: "'Mitr', sans-serif",
  },
  palette: {
    app: appPalette,
  },
});
