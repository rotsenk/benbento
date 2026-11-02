import { Book, GameController, Sparkle } from '@phosphor-icons/react';
import type { TileSize } from '@/content/profile.types';
import { TileWrapper } from '@/shared/components/TileWrapper';

export interface HobbyView {
  label: string;
  icon: string;
}

interface Props {
  id: string;
  size: TileSize;
  title: string;
  items: HobbyView[];
}

function HobbyIcon({ name }: { name: string }) {
  switch (name) {
    case 'Book':
      return <Book size={24} weight="duotone" aria-hidden />;
    case 'GameController':
      return <GameController size={24} weight="duotone" aria-hidden />;
    default:
      return <Sparkle size={24} weight="duotone" aria-hidden />;
  }
}

export function HobbiesTile({ id, size, title, items }: Props) {
  return (
    <TileWrapper id={id} size={size} bgClass="bg-tint-sun">
      <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>

      <ul className="mt-3 space-y-2">
        {items.map((hobby) => (
          <li
            key={`${hobby.icon}-${hobby.label}`}
            className="flex items-center gap-3 rounded-2xl border border-line/70 bg-surface/60 p-2.5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface">
              <HobbyIcon name={hobby.icon} />
            </span>
            <span className="text-sm leading-snug">{hobby.label}</span>
          </li>
        ))}
      </ul>
    </TileWrapper>
  );
}
