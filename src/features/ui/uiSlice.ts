import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Locale } from '@/shared/i18n/types';
import { persistLocale, resolveInitialLocale } from '@/shared/i18n/locale';

export type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'bento.theme';

export function getPersistedTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // localStorage puede estar bloqueado.
  }
  return 'system';
}

interface UiState {
  theme: Theme;
  locale: Locale;
  activeDialog: string | null;
}

const initialState: UiState = {
  theme: getPersistedTheme(),
  locale: resolveInitialLocale(),
  activeDialog: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, action.payload);
      } catch {
        // localStorage puede estar bloqueado; el tema sigue funcionando en memoria.
      }
    },
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
      persistLocale(action.payload);
    },
    openDialog(state, action: PayloadAction<string>) {
      state.activeDialog = action.payload;
    },
    closeDialog(state) {
      state.activeDialog = null;
    },
  },
});

export const { setTheme, setLocale, openDialog, closeDialog } = uiSlice.actions;
export default uiSlice.reducer;
