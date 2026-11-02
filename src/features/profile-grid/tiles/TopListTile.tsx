import type { TileSize } from '@/content/profile.types';
import { TileWrapper } from '@/shared/components/TileWrapper';

interface Props {
  id: string;
  size: TileSize;
  title: string;
  items: [string, string, string];
}

export function TopListTile({ id, size, title, items }: Props) {
  return (
    <TileWrapper id={id} size={size} bgClass="bg-tint-mint">
      <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>

      <ol className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-snug">
            <span className="w-4 shrink-0 pt-0.5 font-mono text-xs text-ink-muted">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </TileWrapper>
  );
}
