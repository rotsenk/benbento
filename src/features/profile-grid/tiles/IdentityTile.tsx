import type { TileSize } from '@/content/profile.types';
import { TileWrapper } from '@/shared/components/TileWrapper';

interface Props {
  id: string;
  size: TileSize;
  name: string;
  headline: string;
  bio: string;
}

export function IdentityTile({ id, size, name, headline, bio }: Props) {
  return (
    <TileWrapper id={id} size={size} className="justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-[clamp(1.75rem,3vw,2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-balance">
          {name}
        </h1>
        <p className="mt-2 text-sm font-medium leading-snug text-ink">{headline}</p>
      </div>

      <p className="max-w-[60ch] text-sm leading-relaxed text-ink-muted">{bio}</p>
    </TileWrapper>
  );
}
