import { configureStore } from '@reduxjs/toolkit';
import uiReducer, { type Theme } from '@/features/ui/uiSlice';
import type { Locale } from '@/shared/i18n/types';

interface Options {
  theme?: Theme;
  locale?: Locale;
  activeDialog?: string | null;
}

export function createTestStore({
  theme = 'light',
  locale = 'en',
  activeDialog = null,
}: Options = {}) {
  return configureStore({
    reducer: { ui: uiReducer },
    preloadedState: {
      ui: { theme, locale, activeDialog },
    },
  });
}
