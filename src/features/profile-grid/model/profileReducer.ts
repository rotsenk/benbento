import type { BentoDocument, Tile, TileSize } from '@/content/profile.types';

export type ProfileAction =
  | { type: 'replace'; document: BentoDocument }
  | { type: 'add'; tile: Tile }
  | { type: 'remove'; id: string }
  | { type: 'toggle'; id: string }
  | { type: 'resize'; id: string; size: TileSize }
  | { type: 'reorder'; from: number; to: number }
  | { type: 'update'; tile: Tile };

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to) return items;
  if (from < 0 || to < 0 || from >= items.length || to >= items.length) return items;

  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function profileReducer(document: BentoDocument, action: ProfileAction): BentoDocument {
  switch (action.type) {
    case 'replace':
      return action.document;

    case 'add':
      return { ...document, tiles: [...document.tiles, action.tile] };

    case 'remove':
      return { ...document, tiles: document.tiles.filter((tile) => tile.id !== action.id) };

    case 'toggle':
      return {
        ...document,
        tiles: document.tiles.map((tile) =>
          tile.id === action.id ? { ...tile, enabled: !tile.enabled } : tile,
        ),
      };

    case 'resize':
      return {
        ...document,
        tiles: document.tiles.map((tile) =>
          tile.id === action.id && tile.type !== 'avatar'
            ? { ...tile, size: action.size }
            : tile,
        ),
      };

    case 'reorder': {
      const tiles = moveItem(document.tiles, action.from, action.to);
      return tiles === document.tiles ? document : { ...document, tiles };
    }

    case 'update':
      return {
        ...document,
        tiles: document.tiles.map((tile) => (tile.id === action.tile.id ? action.tile : tile)),
      };
  }
}
