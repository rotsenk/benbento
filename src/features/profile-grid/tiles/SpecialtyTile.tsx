import { ArrowUpRight } from '@phosphor-icons/react';
import type { TileSize } from '@/content/profile.types';
import { ui } from '@/content/ui';
import { useLocalized } from '@/shared/i18n/useLocalized';
import { TileWrapper } from '@/shared/components/TileWrapper';

interface Props {
  id: string;
  size: TileSize;
  title: string;
  chips: string[];
  portfolio?: {
    label: string;
    href: string;
  };
}

export function SpecialtyTile({ id, size, title, chips, portfolio }: Props) {
  const localize = useLocalized();
  const externalLabel = localize(ui.a11y.externalLink);

  return (
    <TileWrapper id={id} size={size} bgClass="bg-tint-sky">
      <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>

      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label={title}>
        {chips.map((chip) => (
          <li
            key={chip}
            className="rounded-xl border border-line bg-surface/70 px-3 py-1.5 font-mono text-xs text-ink"
          >
            {chip}
          </li>
        ))}
      </ul>

      {portfolio ? (
        <a
          href={portfolio.href}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'mt-4 inline-flex min-h-11 items-center gap-1.5 self-start rounded-xl',
            'border border-line bg-surface/70 px-3 py-2 font-mono text-xs font-medium text-accent',
            'transition-colors duration-150 hover:border-accent',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          ].join(' ')}
        >
          {portfolio.label}
          <ArrowUpRight size={16} aria-hidden />
          <span className="sr-only">({externalLabel})</span>
        </a>
      ) : null}
    </TileWrapper>
  );
}
