import { describe, expect, it } from 'vitest';
import type { Tile } from '@/content/profile.types';
import { hasRequiredFields, isSafeHref, isSafeImageSrc } from './validateTile';

const validLink: Tile = {
  id: 'link',
  type: 'link',
  size: '1x1',
  enabled: true,
  platform: 'other',
  label: 'Ejemplo',
  handle: '@ejemplo',
  href: 'https://example.com',
};

describe('validateTile', () => {
  it('acepta solo http(s) y mailto en enlaces', () => {
    expect(isSafeHref('https://example.com')).toBe(true);
    expect(isSafeHref('mailto:hola@example.com')).toBe(true);
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
    expect(isSafeHref('data:text/html,hola')).toBe(false);
  });

  it('acepta rutas locales y https en imágenes, pero no protocol-relative', () => {
    expect(isSafeImageSrc('/images/a.webp')).toBe(true);
    expect(isSafeImageSrc('./images/a.webp')).toBe(true);
    expect(isSafeImageSrc('https://example.com/a.webp')).toBe(true);
    expect(isSafeImageSrc('//example.com/a.webp')).toBe(false);
    expect(isSafeImageSrc('data:image/png;base64,abc')).toBe(false);
  });

  it('valida un tile de enlace y rechaza un href inseguro', () => {
    expect(hasRequiredFields(validLink)).toBe(true);
    expect(
      hasRequiredFields({ ...validLink, id: 'bad', href: 'javascript:alert(1)' }),
    ).toBe(false);
  });

  it('valida campos bilingües y listas completas', () => {
    const topList: Tile = {
      id: 'top',
      type: 'top-list',
      size: '1x1',
      enabled: true,
      title: { es: 'Series', en: 'Shows' },
      items: ['Uno', 'Dos', 'Tres'],
    };

    expect(hasRequiredFields(topList)).toBe(true);
    expect(
      hasRequiredFields({ ...topList, title: { es: 'Series', en: '' } }),
    ).toBe(false);
  });

  it('valida el enlace opcional de portafolio en Especialidad', () => {
    const specialty: Extract<Tile, { type: 'specialty' }> = {
      id: 'specialty',
      type: 'specialty',
      size: '2x1',
      enabled: true,
      title: { es: 'Especialidad', en: 'Specialty' },
      chips: ['React'],
      portfolio: {
        label: { es: 'Ver portafolio', en: 'View portfolio' },
        href: 'https://nestor-rivas-portfolio.netlify.app/',
      },
    };

    expect(hasRequiredFields(specialty)).toBe(true);
    expect(
      hasRequiredFields({
        ...specialty,
        portfolio: { ...specialty.portfolio!, href: 'javascript:alert(1)' },
      }),
    ).toBe(false);
    expect(
      hasRequiredFields({
        ...specialty,
        portfolio: { label: { es: 'Ver portafolio', en: '' }, href: 'https://example.com' },
      }),
    ).toBe(false);
  });

  it('valida el avatar fuera del grid y su texto alternativo bilingüe', () => {
    const avatar: Tile = {
      id: 'avatar',
      type: 'avatar',
      enabled: true,
      image: {
        src: '/images/me-nestor.png',
        alt: { es: 'Retrato de Nestor Rivas', en: 'Portrait of Nestor Rivas' },
        width: 800,
        height: 800,
      },
    };

    expect(hasRequiredFields(avatar)).toBe(true);
    expect(
      hasRequiredFields({
        ...avatar,
        image: { ...avatar.image, alt: { es: 'Retrato', en: '' } },
      }),
    ).toBe(false);
  });
});
