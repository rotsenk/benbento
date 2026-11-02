import type { TileSize } from '@/content/profile.types';

export const SIZE_CLASSES: Record<TileSize, string> = {
  '1x1': 'col-span-1 row-span-1',
  '2x1': 'col-span-1 row-span-1 sm:col-span-2',
  '1x2': 'col-span-1 row-span-1 sm:col-span-1 sm:row-span-2',
  '2x2': 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-2',
};

/** La mascota conserva su retrato 1x2 en una columna y pasa a 2x1 en dos o cuatro. */
export const WIDE_PHOTO_ON_DESKTOP_CLASSES =
  'col-span-1 row-span-2 sm:col-span-2 sm:row-span-1';
