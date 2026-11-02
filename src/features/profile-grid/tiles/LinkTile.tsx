import {
  ArrowRight,
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  XLogo,
} from '@phosphor-icons/react';
import type { LinkPlatform, TileSize } from '@/content/profile.types';
import { ui } from '@/content/ui';
import { isSafeHref } from '@/features/profile-grid/model/validateTile';
import { useLocalized } from '@/shared/i18n/useLocalized';
import { SIZE_CLASSES } from '@/shared/components/tileStyles';

interface Props {
  id: string;
  size: TileSize;
  platform: LinkPlatform;
  label: string;
  handle: string;
  href: string;
}

const PLATFORM_STYLES: Record<LinkPlatform, string> = {
  linkedin:
    'border-accent bg-accent text-accent-ink hover:bg-accent/90 focus-visible:outline-accent-ink',
  github: 'border-line bg-surface-2 text-ink hover:border-accent focus-visible:outline-accent',
  x: 'border-line bg-surface-2 text-ink hover:border-accent focus-visible:outline-accent',
  email: 'border-line bg-surface-2 text-ink hover:border-accent focus-visible:outline-accent',
  other: 'border-line bg-surface text-ink hover:border-accent focus-visible:outline-accent',
};

function PlatformIcon({ platform }: { platform: LinkPlatform }) {
  switch (platform) {
    case 'linkedin':
      return <LinkedinLogo size={28} weight="fill" aria-hidden />;
    case 'github':
      return <GithubLogo size={28} weight="fill" aria-hidden />;
    case 'x':
      return <XLogo size={28} weight="bold" aria-hidden />;
    case 'email':
      return <EnvelopeSimple size={28} aria-hidden />;
    case 'other':
      return <ArrowUpRight size={28} aria-hidden />;
  }
}

export function LinkTile({
  id,
  size,
  platform,
  label,
  handle,
  href,
}: Props) {
  const localize = useLocalized();

  if (!isSafeHref(href)) {
    if (import.meta.env.DEV) {
      console.warn(`Tile "${id}" tiene un href no permitido y no se renderiza.`);
    }
    return null;
  }

  const isExternal = /^https?:\/\//i.test(href);
  const externalLabel = localize(ui.a11y.externalLink);

  return (
    <article
      data-tile-id={id}
      data-size={size}
      className={[SIZE_CLASSES[size], 'group min-h-[120px]'].join(' ')}
    >
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={[
          PLATFORM_STYLES[platform],
          'flex h-full w-full flex-col justify-between rounded-3xl border p-5 sm:p-6',
          'transition-[transform,background-color,border-color] duration-150',
          'motion-safe:hover:-translate-y-0.5',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
        ].join(' ')}
      >
        <span className="flex items-start justify-between">
          <PlatformIcon platform={platform} />
          {isExternal ? (
            <ArrowUpRight size={20} aria-hidden className="opacity-70" />
          ) : (
            <ArrowRight size={20} aria-hidden className="opacity-70" />
          )}
        </span>

        <span className="mt-6 block">
          <h2 className="font-display text-base font-semibold sm:text-lg">{label}</h2>
          <span className="mt-0.5 block text-sm">{handle}</span>
        </span>

        {isExternal ? <span className="sr-only">({externalLabel})</span> : null}
      </a>
    </article>
  );
}
