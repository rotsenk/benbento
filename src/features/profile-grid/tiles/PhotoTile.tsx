import { useState } from 'react';
import type { TileSize } from '@/content/profile.types';
import { WIDE_PHOTO_ON_DESKTOP_CLASSES } from '@/shared/components/tileStyles';
import { TileWrapper } from '@/shared/components/TileWrapper';

interface Props {
  id: string;
  size: TileSize;
  caption: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  wideOnDesktop?: boolean;
}

export function PhotoTile({ id, size, caption, image, wideOnDesktop = false }: Props) {
  const [failed, setFailed] = useState(false);

  const initials = caption
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <TileWrapper
      id={id}
      size={size}
      sizeClassName={wideOnDesktop ? WIDE_PHOTO_ON_DESKTOP_CLASSES : undefined}
      padded={false}
      bgClass="bg-tint-coral"
      className="relative overflow-hidden"
    >
      {failed ? (
        <div
          role="img"
          aria-label={image.alt}
          className="absolute inset-0 flex items-center justify-center bg-tint-coral font-display text-4xl font-semibold text-ink"
        >
          {initials}
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <h2 className="relative mt-auto bg-gradient-to-t from-photo-overlay via-photo-overlay/50 to-transparent p-5 pt-16 text-sm font-medium text-photo-overlay-ink sm:p-6 sm:pt-20">
        {caption}
      </h2>
    </TileWrapper>
  );
}
