import { useState } from 'react';

interface Props {
  name: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export function ProfileAvatar({ name, image }: Props) {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <figure
      data-profile-avatar
      className="size-32 shrink-0 overflow-hidden rounded-full border border-line bg-tint-sky shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:size-40"
    >
      {failed ? (
        <div
          role="img"
          aria-label={image.alt}
          className="flex h-full w-full items-center justify-center font-display text-3xl font-semibold text-ink"
        >
          {initials}
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="eager"
          decoding="async"
          {...{ fetchpriority: 'high' }}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </figure>
  );
}
