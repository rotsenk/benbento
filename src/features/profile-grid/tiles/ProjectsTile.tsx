import { ArrowUpRight } from '@phosphor-icons/react';
import type { TileSize } from '@/content/profile.types';
import { ui } from '@/content/ui';
import { isSafeHref } from '@/features/profile-grid/model/validateTile';
import { useLocalized } from '@/shared/i18n/useLocalized';
import { TileWrapper } from '@/shared/components/TileWrapper';

export interface ProjectView {
  name: string;
  summary: string;
  href?: string;
}

interface Props {
  id: string;
  size: TileSize;
  title: string;
  items: ProjectView[];
}

export function ProjectsTile({ id, size, title, items }: Props) {
  const localize = useLocalized();

  return (
    <TileWrapper id={id} size={size} bgClass="bg-surface-2">
      <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>

      <ul className="mt-3 space-y-3">
        {items.map((project) => (
          <li key={project.name} className="rounded-2xl border border-line bg-surface/70 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-sm font-semibold">{project.name}</p>
              {project.href && isSafeHref(project.href) ? (
                <a
                  href={project.href}
                  target={/^https?:\/\//i.test(project.href) ? '_blank' : undefined}
                  rel={/^https?:\/\//i.test(project.href) ? 'noopener noreferrer' : undefined}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-ink-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  <ArrowUpRight size={18} aria-hidden />
                  <span className="sr-only">
                    {localize(ui.link.open)}: {project.name}
                  </span>
                </a>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{project.summary}</p>
          </li>
        ))}
      </ul>
    </TileWrapper>
  );
}
