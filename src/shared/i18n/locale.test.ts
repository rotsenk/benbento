import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LOCALE_STORAGE_KEY, localeUrl, resolveInitialLocale } from './locale';

const originalLanguage = Object.getOwnPropertyDescriptor(window.navigator, 'language');

function setNavigatorLanguage(language: string) {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value: language,
  });
}

function setSearch(search: string) {
  window.history.replaceState(null, '', `/${search}`);
}

beforeEach(() => {
  window.localStorage.clear();
  setNavigatorLanguage('en-US');
  setSearch('');
});

afterEach(() => {
  if (originalLanguage) {
    Object.defineProperty(window.navigator, 'language', originalLanguage);
  } else {
    Reflect.deleteProperty(window.navigator, 'language');
  }
  window.history.replaceState(null, '', '/');
});

describe('resolveInitialLocale', () => {
  it('prioriza ?lang sobre localStorage', () => {
    setSearch('?lang=en');
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'es');

    expect(resolveInitialLocale()).toBe('en');
  });

  it('usa ?lang=es aunque localStorage tenga en', () => {
    setSearch('?lang=es');
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'en');

    expect(resolveInitialLocale()).toBe('es');
  });

  it('usa localStorage cuando no hay un ?lang válido', () => {
    setSearch('?lang=fr');
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'es');

    expect(resolveInitialLocale()).toBe('es');
  });

  it('detecta español desde navigator.language', () => {
    setNavigatorLanguage('es-SV');

    expect(resolveInitialLocale()).toBe('es');
  });

  it('usa inglés para idiomas distintos de español', () => {
    setNavigatorLanguage('fr-FR');

    expect(resolveInitialLocale()).toBe('en');
  });

  it('cae en inglés sin señales', () => {
    setNavigatorLanguage('');

    expect(resolveInitialLocale()).toBe('en');
  });
});

describe('localeUrl', () => {
  it('conserva el resto de parámetros y el hash', () => {
    window.history.replaceState(null, '', '/?edit=1#perfil');

    expect(localeUrl('es')).toBe('/?edit=1&lang=es#perfil');
  });
});
