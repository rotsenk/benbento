import { EnvelopeSimple } from '@phosphor-icons/react';
import type { TileSize } from '@/content/profile.types';
import { ui } from '@/content/ui';
import { useLocalized } from '@/shared/i18n/useLocalized';
import { SIZE_CLASSES } from '@/shared/components/tileStyles';

interface Props {
  id: string;
  size: TileSize;
  title: string;
  email: string;
  href: string;
}

export function ContactTile({ id, size, title, email, href }: Props) {
  const localize = useLocalized();

  return (
    <article
      data-tile-id={id}
      data-size={size}
      className={[SIZE_CLASSES[size], 'group min-h-[120px]'].join(' ')}
    >
      <a
        href={href}
        className={[
          'flex h-full w-full flex-col justify-between rounded-3xl border border-line bg-tint-sky p-5 sm:p-6',
          'transition-[transform,border-color] duration-150 hover:border-accent',
          'motion-safe:hover:-translate-y-0.5',
          'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        ].join(' ')}
      >
        <span className="flex items-start justify-between">
          <EnvelopeSimple size={28} aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            {localize(ui.link.open)}
          </span>
        </span>

        <span className="mt-6 block">
          <h2 className="font-display text-base font-semibold sm:text-lg">{title}</h2>
          <span className="mt-0.5 block break-all text-sm text-ink-muted">{email}</span>
        </span>
      </a>
    </article>
  );
}
