import type { ReactNode } from 'react';
import type { TileSize } from '@/content/profile.types';
import { SIZE_CLASSES } from './tileStyles';

interface Props {
  id: string;
  size: TileSize;
  sizeClassName?: string;
  bgClass?: string;
  className?: string;
  padded?: boolean;
  children: ReactNode;
}

/**
 * Envoltorio común de los tiles no interactivos.
 * El tamaño se resuelve con un mapa estático para que Tailwind lo detecte.
 */
export function TileWrapper({
  id,
  size,
  sizeClassName,
  bgClass = 'bg-surface',
  className = '',
  padded = true,
  children,
}: Props) {
  return (
    <article
      data-tile-id={id}
      data-size={size}
      className={[
        sizeClassName ?? SIZE_CLASSES[size],
        bgClass,
        'min-h-[120px]',
        'rounded-3xl border border-line',
        padded ? 'p-5 sm:p-6' : '',
        'shadow-[0_1px_2px_rgb(0_0_0/0.04)]',
        'flex flex-col',
        className,
      ].join(' ')}
    >
      {children}
    </article>
  );
}
