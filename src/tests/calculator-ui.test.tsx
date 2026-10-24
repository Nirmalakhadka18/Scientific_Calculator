import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App.js';

describe('Calculator UI Component Tests', () => {
  it('renders the calculator chassis, title and display', () => {
    render(<App />);
    expect(screen.getAllByText(/fx-991ES PLUS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/NATURAL-V\.P\.A\.M\./i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Math/i)).toBeInTheDocument();
  });

  it('performs basic arithmetic calculation via UI clicks', () => {
    render(<App />);

    // Click 2 + 3 × 4 =
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));

    // Result should be 14
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('clears display with AC button', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    fireEvent.click(screen.getByRole('button', { name: 'AC' }));

    // Display should be empty
    expect(screen.queryByText('78')).not.toBeInTheDocument();
  });

  it('toggles angle unit between DEG and RAD via MODE button', () => {
    render(<App />);

    const indicator = screen.getByTestId('angle-unit-indicator');
    // Initially 'D' is displayed
    expect(indicator).toHaveTextContent('D');

    // Click MODE
    fireEvent.click(screen.getByRole('button', { name: 'MODE' }));

    // Now 'R' is displayed
    expect(indicator).toHaveTextContent('R');
  });

  it('toggles between exact fraction and decimal via S<=>D button', () => {
    render(<App />);

    // 1 ÷ 2 =
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));

    // Exact fraction is initially displayed
    expect(screen.getByText('[d/c]')).toBeInTheDocument();

    // Click S<=>D
    fireEvent.click(screen.getByRole('button', { name: 'S<=>D' }));

    // Decimal is displayed
    expect(screen.getByText('0.5')).toBeInTheDocument();
    expect(screen.getByText('[DEC]')).toBeInTheDocument();

    // Click S<=>D again to return to fraction
    fireEvent.click(screen.getByRole('button', { name: 'S<=>D' }));
    expect(screen.getByText('[d/c]')).toBeInTheDocument();
  });
});
