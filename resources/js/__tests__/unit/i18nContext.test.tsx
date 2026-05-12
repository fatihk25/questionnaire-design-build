import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { I18nProvider, useI18n } from '@/contexts/I18nContext';

// Helper component to test the hook
function TestConsumer() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="translated">{t('app.title')}</span>
      <span data-testid="missing-key">{t('nonexistent.key')}</span>
      <button onClick={() => setLocale('en')} data-testid="switch-en">EN</button>
      <button onClick={() => setLocale('id')} data-testid="switch-id">ID</button>
    </div>
  );
}

describe('I18nContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to Indonesian locale when no preference stored', () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('id');
    expect(screen.getByTestId('translated').textContent).toBe('Kuesioner Design and Build');
  });

  it('returns the key itself when translation key is missing', () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('missing-key').textContent).toBe('nonexistent.key');
  });

  it('switches locale to English and re-renders translated text', () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    act(() => {
      screen.getByTestId('switch-en').click();
    });

    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('translated').textContent).toBe('Design and Build Questionnaire');
  });

  it('persists locale preference to localStorage', () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    act(() => {
      screen.getByTestId('switch-en').click();
    });

    expect(localStorage.getItem('locale-preference')).toBe('en');
  });

  it('restores locale preference from localStorage on load', () => {
    localStorage.setItem('locale-preference', 'en');

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('translated').textContent).toBe('Design and Build Questionnaire');
  });

  it('switches back to Indonesian from English', () => {
    localStorage.setItem('locale-preference', 'en');

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );

    act(() => {
      screen.getByTestId('switch-id').click();
    });

    expect(screen.getByTestId('locale').textContent).toBe('id');
    expect(screen.getByTestId('translated').textContent).toBe('Kuesioner Design and Build');
    expect(localStorage.getItem('locale-preference')).toBe('id');
  });

  it('throws error when useI18n is used outside provider', () => {
    // Suppress React error boundary console output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useI18n must be used within an I18nProvider');

    consoleSpy.mockRestore();
  });
});
