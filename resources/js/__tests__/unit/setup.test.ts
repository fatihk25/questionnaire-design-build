import { describe, it, expect } from 'vitest';

describe('Testing framework setup', () => {
  it('vitest runs correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('jsdom environment is available', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  it('jest-dom matchers are available', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello';
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });
});
