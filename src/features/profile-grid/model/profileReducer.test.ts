import { describe, expect, it } from 'vitest';
import type { BentoDocument, Tile } from '@/content/profile.types';
import { profileReducer } from './profileReducer';

function makeLinkTile(id: string): Tile {
  return {
    id,
    type: 'link',
    size: '1x1',
    enabled: true,
    platform: 'other',
    label: id,
    handle: id,
    href: 'https://example.com',
  };
}

function tileSize(tile: Tile) {
  return tile.type === 'avatar' ? null : tile.size;
}

const document: BentoDocument = {
  version: 1,
  tiles: [makeLinkTile('a'), makeLinkTile('b'), makeLinkTile('c')],
};

describe('profileReducer', () => {
  it('mueve tiles sin mutar el documento original', () => {
    const next = profileReducer(document, { type: 'reorder', from: 0, to: 2 });

    expect(next.tiles.map((tile) => tile.id)).toEqual(['b', 'c', 'a']);
    expect(document.tiles.map((tile) => tile.id)).toEqual(['a', 'b', 'c']);
  });

  it('alterna la visibilidad y el tamaño de un tile', () => {
    const hidden = profileReducer(document, { type: 'toggle', id: 'b' });
    const resized = profileReducer(hidden, { type: 'resize', id: 'b', size: '2x2' });

    expect(hidden.tiles[1].enabled).toBe(false);
    expect(tileSize(resized.tiles[1])).toBe('2x2');
    expect(document.tiles[1].enabled).toBe(true);
    expect(tileSize(document.tiles[1])).toBe('1x1');
  });

  it('no redimensiona el avatar porque vive fuera del grid', () => {
    const avatar: Tile = {
      id: 'avatar',
      type: 'avatar',
      enabled: true,
      image: {
        src: '/images/me-nestor.png',
        alt: { es: 'Retrato', en: 'Portrait' },
        width: 800,
        height: 800,
      },
    };
    const withAvatar = profileReducer(document, { type: 'add', tile: avatar });
    const resized = profileReducer(withAvatar, { type: 'resize', id: 'avatar', size: '2x2' });

    expect(resized.tiles[3]).toEqual(avatar);
  });

  it('agrega, actualiza y quita tiles', () => {
    const added = profileReducer(document, { type: 'add', tile: makeLinkTile('d') });
    const updated = profileReducer(added, { type: 'update', tile: makeLinkTile('b') });
    const removed = profileReducer(updated, { type: 'remove', id: 'a' });

    expect(added.tiles).toHaveLength(4);
    expect(updated.tiles).toHaveLength(4);
    expect(removed.tiles.map((tile) => tile.id)).toEqual(['b', 'c', 'd']);
  });

  it('reemplaza el documento completo', () => {
    const replacement: BentoDocument = { version: 1, tiles: [makeLinkTile('z')] };

    expect(profileReducer(document, { type: 'replace', document: replacement })).toBe(replacement);
  });

  it('ignora reorders fuera de rango', () => {
    expect(profileReducer(document, { type: 'reorder', from: 5, to: 1 })).toBe(document);
    expect(profileReducer(document, { type: 'reorder', from: 1, to: 9 })).toBe(document);
  });
});
