import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function TestConsumer() {
  const { isDark, toggleDark } = useTheme();
  return (
    <div>
      <span data-testid="status">{isDark ? 'dark' : 'light'}</span>
      <button onClick={toggleDark}>Toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light mode when no preference is stored', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('restores dark mode preference from localStorage', () => {
    localStorage.setItem('theme-preference', 'dark');

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('restores light mode preference from localStorage', () => {
    localStorage.setItem('theme-preference', 'light');

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles from light to dark mode', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(screen.getByTestId('status')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme-preference')).toBe('dark');
  });

  it('toggles from dark to light mode', async () => {
    localStorage.setItem('theme-preference', 'dark');
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(screen.getByTestId('status')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme-preference')).toBe('light');
  });

  it('persists preference to localStorage on toggle', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(localStorage.getItem('theme-preference')).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(localStorage.getItem('theme-preference')).toBe('light');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress React error boundary console output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );

    consoleSpy.mockRestore();
  });
});
