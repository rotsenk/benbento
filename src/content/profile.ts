import type { BentoDocument } from './profile.types';

/**
 * Contenido publicable del perfil.
 */
export const profile = {
  version: 1,
  tiles: [
    {
      id: 'avatar',
      type: 'avatar',
      enabled: true,
      image: {
        src: '/images/me-nestor.webp',
        alt: { es: 'Retrato de Nestor Rivas', en: 'Portrait of Nestor Rivas' },
        width: 480,
        height: 480,
      },
    },
    {
      id: 'identity',
      type: 'identity',
      size: '1x1',
      enabled: true,
      name: 'Nestor Rivas',
      headline: {
        es: 'Frontend Developer · SPAs empresariales',
        en: 'Frontend Developer · Enterprise SPAs',
      },
      bio: {
        es: 'Vengo de la educación superior y construyo interfaces escalables con React y TypeScript.',
        en: 'I come from higher education and build scalable interfaces with React and TypeScript.',
      },
    },
    {
      id: 'linkedin',
      type: 'link',
      size: '1x1',
      enabled: true,
      platform: 'linkedin',
      label: 'LinkedIn',
      handle: 'Nestor Rivas',
      href: 'https://www.linkedin.com/in/nestor-rivas-5a6163196/',
    },
    {
      id: 'specialty',
      type: 'specialty',
      size: '2x1',
      enabled: true,
      title: { es: 'Especialidad', en: 'Specialty' },
      chips: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      portfolio: {
        label: { es: 'Ver portafolio', en: 'View portfolio' },
        href: 'https://nestor-rivas-portfolio.netlify.app/',
      },
    },
    {
      id: 'experience',
      type: 'experience',
      size: '2x1',
      enabled: true,
      summary: [
        {
          period: '5+',
          role: { es: 'Educación superior', en: 'Higher education' },
          place: 'UGB, UDB, FUSALMO, UNIVO',
        },
        {
          period: '3+',
          role: { es: 'Desarrollo de software', en: 'Software development' },
          place: 'GF, InterTech',
        },
        {
          period: '●',
          role: { es: 'Frontend Developer', en: 'Frontend Developer' },
          place: 'Freelance',
        },
      ],
      timeline: [
        {
          period: '5+',
          role: {
            es: 'Coordinación de carreras de IT y docencia',
            en: 'IT program coordination and teaching',
          },
          place: 'UNIVO',
          detail: {
            es: 'Más de cinco años de experiencia previa en educación superior.',
            en: 'More than five years of previous experience in higher education.',
          },
        },
        {
          period: '3',
          role: { es: 'Desarrollo de software', en: 'Software development' },
          place: 'GF, InterTech',
          detail: {
            es: 'Alrededor de tres años de desarrollo profesional.',
            en: 'Around three years of professional software development.',
          },
        },
        {
          period: '●',
          role: { es: 'Frontend Developer', en: 'Frontend Developer' },
          place: 'Freelance',
          detail: {
            es: 'Enfoque en SPAs empresariales, accesibilidad y rendimiento.',
            en: 'Focused on enterprise SPAs, accessibility and performance.',
          },
        },
      ],
    },
    {
      id: 'spotify',
      type: 'spotify',
      size: '2x1',
      enabled: true,
      title: { es: 'Música', en: 'Music' },
      playlistId: '2lkbVzByXcQBg0cEzPS22C',
      href: 'https://open.spotify.com/playlist/2lkbVzByXcQBg0cEzPS22C?si=49f2568de1a24548',
    },
    {
      id: 'pet',
      type: 'photo',
      size: '1x2',
      enabled: true,
      image: {
        src: '/images/meandpuppy.webp',
        alt: { es: 'Mi mascota', en: 'Pet photo' },
        width: 1282,
        height: 1440,
      },
      caption: {
        es: 'Mi perrito, mi lugar feliz y mi inspiración.',
        en: 'My puppy, my happy place and my inspiration.',
      },
    },
    {
      id: 'series',
      type: 'top-list',
      size: '1x1',
      enabled: true,
      title: { es: 'Top series fav', en: 'Top favorite shows' },
      items: [
        'The Vampire Diaries',
        'Supernatural',
        'Stranger Things',
      ],
    },
    {
      id: 'hobbies',
      type: 'hobbies',
      size: '1x1',
      enabled: true,
      title: { es: 'Hobbies', en: 'Hobbies' },
      items: [
        {
          label: { es: 'Ver series', en: 'Watch series' },
          icon: 'GameController',
        },
        {
          label: { es: 'Leer', en: 'Reading' },
          icon: 'Book',
        },
      ],
    },
  ],
} satisfies BentoDocument;

export default profile;

