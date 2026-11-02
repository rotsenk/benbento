import { useState } from 'react';
import { Play, SpotifyLogo } from '@phosphor-icons/react';
import type { TileSize } from '@/content/profile.types';
import { ui } from '@/content/ui';
import { isSafeHref } from '@/features/profile-grid/model/validateTile';
import { useLocalized } from '@/shared/i18n/useLocalized';
import { TileWrapper } from '@/shared/components/TileWrapper';

interface Props {
  id: string;
  size: TileSize;
  title: string;
  playlistId: string;
  href: string;
}

export function SpotifyTile({ id, size, title, playlistId, href }: Props) {
  const localize = useLocalized();
  const [loaded, setLoaded] = useState(false);

  if (!isSafeHref(href)) return null;

  const embedSrc = `https://open.spotify.com/embed/playlist/${encodeURIComponent(playlistId)}?utm_source=generator`;

  return (
    <TileWrapper id={id} size={size} bgClass="bg-tint-mint" className="gap-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>
        <SpotifyLogo size={26} weight="fill" aria-hidden className="shrink-0" />
      </div>

      <div className="mt-2 flex items-center gap-4">
        <div
          aria-hidden
          className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-tint-mint sm:size-20"
        >
          <span className="absolute size-12 rounded-full border border-accent/25 sm:size-14" />
          <span className="absolute size-7 rounded-full border border-accent/20 sm:size-8" />
          <SpotifyLogo size={32} weight="fill" className="relative text-ink" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {loaded ? (
            <iframe
              title={localize(ui.spotify.iframeTitle)}
              src={embedSrc}
              height={82}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full rounded-2xl border border-line bg-surface"
            />
          ) : (
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors duration-150 hover:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <Play size={16} weight="fill" aria-hidden />
              {localize(ui.spotify.playHere)}
            </button>
          )}

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <SpotifyLogo size={16} weight="fill" aria-hidden />
            {localize(ui.spotify.openInSpotify)}
            <span className="sr-only">({localize(ui.a11y.externalLink)})</span>
          </a>
        </div>
      </div>
    </TileWrapper>
  );
}
