import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

function createMediaQueryList(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  document.documentElement.lang = 'es';
  document.documentElement.removeAttribute('data-theme');

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => createMediaQueryList(query)),
  });
});

afterEach(() => {
  cleanup();
});
