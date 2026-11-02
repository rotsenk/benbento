export type Locale = 'es' | 'en';

export interface Localized<T = string> {
  es: T;
  en: T;
}

export function resolveLocale<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
