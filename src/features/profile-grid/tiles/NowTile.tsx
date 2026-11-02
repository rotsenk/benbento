import type { TileSize } from '@/content/profile.types';
import { TileWrapper } from '@/shared/components/TileWrapper';

interface Props {
  id: string;
  size: TileSize;
  title: string;
  body: string;
}

export function NowTile({ id, size, title, body }: Props) {
  return (
    <TileWrapper id={id} size={size} bgClass="bg-surface-2">
      <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </TileWrapper>
  );
}
