import { render, screen } from '@testing-library/react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { AppPrimaryText } from './App.styled';
import { appPalette, muiTheme } from './theme';

test('palette keeps the original brand values so the visual design is unchanged', () => {
  expect(appPalette.brand).toBe('#c2442a');
  expect(appPalette.brandHover).toBe('#d34f34');
  expect(appPalette.onBrand).toBe('#fff');
  expect(appPalette.sky).toBe('#89cff0');
  expect(appPalette.sand).toBe('#e3c8a4');
  expect(appPalette.danger).toBe('#f04438');
  expect(appPalette.surface).toBe('rgba(255, 255, 255, 0.4)');
});

test('MUI theme exposes the app palette and keeps the typography', () => {
  expect(muiTheme.palette.app).toEqual(appPalette);
  expect(muiTheme.typography.fontFamily).toBe("'Mitr', sans-serif");
});

test('styled components resolve their colour from the theme', () => {
  render(
    <StyledThemeProvider theme={muiTheme}>
      <AppPrimaryText>Brand text</AppPrimaryText>
    </StyledThemeProvider>,
  );

  expect(screen.getByText('Brand text')).toHaveStyle({ color: 'rgb(194, 68, 42)' });
});
