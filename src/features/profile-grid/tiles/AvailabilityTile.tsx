import type { TileSize } from '@/content/profile.types';
import { TileWrapper } from '@/shared/components/TileWrapper';

interface Props {
  id: string;
  size: TileSize;
  title: string;
  timezone: string;
  modes: string[];
}

export function AvailabilityTile({ id, size, title, timezone, modes }: Props) {
  return (
    <TileWrapper id={id} size={size} bgClass="bg-surface-2">
      <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>
      <p className="mt-1 font-mono text-xs text-ink-muted">{timezone}</p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {modes.map((mode) => (
          <li
            key={mode}
            className="rounded-xl border border-line bg-surface px-2.5 py-1 text-xs font-medium"
          >
            {mode}
          </li>
        ))}
      </ul>
    </TileWrapper>
  );
}
