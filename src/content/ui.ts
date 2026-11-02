import type { Localized } from '@/shared/i18n/types';

interface UiStrings {
  pageTitle: Localized;
  metaDescription: Localized;
  a11y: {
    skipToContent: Localized;
    profileGrid: Localized;
    languageChanged: Localized;
    openExperience: Localized;
    closeDialog: Localized;
    externalLink: Localized;
  };
  header: {
    languageLabel: Localized;
    spanish: Localized;
    english: Localized;
    switchToDark: Localized;
    switchToLight: Localized;
  };
  experience: {
    title: Localized;
    open: Localized;
    close: Localized;
  };
  spotify: {
    playHere: Localized;
    openInSpotify: Localized;
    iframeTitle: Localized;
  };
  link: {
    open: Localized;
  };
}

export const ui = {
  pageTitle: {
    es: 'Nestor Rivas  | Frontend Developer',
    en: 'Nestor Rivas | Frontend Developer',
  },
  metaDescription: {
    es: 'Bento personal de Nestor Rivas: especialidad, trayectoria, música, series y hobbies.',
    en: 'Nestor Rivas’ personal bento: specialty, experience, music, shows and hobbies.',
  },
  a11y: {
    skipToContent: { es: 'Saltar al contenido', en: 'Skip to content' },
    profileGrid: { es: 'Tiles del perfil', en: 'Profile tiles' },
    languageChanged: { es: 'Idioma cambiado a español.', en: 'Language changed to English.' },
    openExperience: { es: 'Abrir trayectoria completa', en: 'Open full career' },
    closeDialog: { es: 'Cerrar diálogo', en: 'Close dialog' },
    externalLink: { es: 'Se abre en una pestaña nueva', en: 'Opens in a new tab' },
  },
  header: {
    languageLabel: { es: 'Idioma', en: 'Language' },
    spanish: { es: 'Español', en: 'Spanish' },
    english: { es: 'Inglés', en: 'English' },
    switchToDark: { es: 'Cambiar a tema oscuro', en: 'Switch to dark theme' },
    switchToLight: { es: 'Cambiar a tema claro', en: 'Switch to light theme' },
  },
  experience: {
    title: { es: 'Experiencia', en: 'Experience' },
    open: { es: 'Ver experiencia completa', en: 'View full experience' },
    close: { es: 'Cerrar', en: 'Close' },
  },
  spotify: {
    playHere: { es: 'Reproducir aquí', en: 'Play here' },
    openInSpotify: { es: 'Abrir en Spotify', en: 'Open in Spotify' },
    iframeTitle: { es: 'Reproductor de Spotify', en: 'Spotify player' },
  },
  link: {
    open: { es: 'Abrir enlace', en: 'Open link' },
  },
} satisfies UiStrings;

