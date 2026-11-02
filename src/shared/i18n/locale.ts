import type { Locale } from './types';

export const LOCALE_STORAGE_KEY = 'bento.locale';

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en';
}

export function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage puede estar bloqueado; el idioma sigue funcionando en memoria.
  }
}

export function resolveInitialLocale(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLocale(fromUrl)) return fromUrl;

  const stored = readStoredLocale();
  if (stored) return stored;

  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function localeUrl(locale: Locale): string {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  return `${url.pathname}${url.search}${url.hash}`;
}
