import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the solo helper with its card draw controls', () => {
  render(<App />);

  expect(screen.getByText("Hadrian's Wall Solo Helper")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /draw fate card/i })).toBeInTheDocument();
});