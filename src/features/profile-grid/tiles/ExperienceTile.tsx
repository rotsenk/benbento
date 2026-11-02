import { useRef } from 'react';
import { CaretRight } from '@phosphor-icons/react';
import type { TileSize } from '@/content/profile.types';
import { ui } from '@/content/ui';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { openDialog, closeDialog } from '@/features/ui/uiSlice';
import { useLocalized } from '@/shared/i18n/useLocalized';
import { Dialog } from '@/shared/components/Dialog';
import { TileWrapper } from '@/shared/components/TileWrapper';

export interface MilestoneView {
  period: string;
  role: string;
  place: string;
  detail?: string;
}

interface Props {
  id: string;
  size: TileSize;
  summary: MilestoneView[];
  timeline: MilestoneView[];
}

export function ExperienceTile({ id, size, summary, timeline }: Props) {
  const dispatch = useAppDispatch();
  const localize = useLocalized();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isOpen = useAppSelector((state) => state.ui.activeDialog === id);

  const title = localize(ui.experience.title);
  const openLabel = localize(ui.experience.open);

  return (
    <TileWrapper id={id} size={size} className="gap-3">
      <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => dispatch(openDialog(id))}
        className="group -mx-2 flex w-[calc(100%+1rem)] flex-1 flex-col justify-between rounded-2xl px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <span className="block w-full space-y-1.5">
          {summary.map((milestone) => (
            <span
              key={`${milestone.period}-${milestone.role}`}
              className="flex items-baseline gap-2 text-sm"
            >
              <span className="w-8 shrink-0 font-mono text-xs text-ink-muted">
                {milestone.period}
              </span>
              <span className="min-w-0">
                <span className="font-medium">{milestone.role}</span>{' '}
                <span className="text-ink-muted">{milestone.place}</span>
              </span>
            </span>
          ))}
        </span>

        <span className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-accent">
          {openLabel}
          <CaretRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>

      <Dialog
        isOpen={isOpen}
        title={title}
        closeLabel={localize(ui.a11y.closeDialog)}
        onClose={() => dispatch(closeDialog())}
        triggerRef={triggerRef}
      >
        <ol className="space-y-4 border-l border-line pl-4">
          {timeline.map((milestone) => (
            <li key={`${milestone.period}-${milestone.role}`}>
              <p className="font-mono text-xs text-ink-muted">{milestone.period}</p>
              <p className="mt-1 font-display text-base font-semibold">{milestone.role}</p>
              <p className="text-sm text-ink-muted">{milestone.place}</p>
              {milestone.detail ? (
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{milestone.detail}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </Dialog>
    </TileWrapper>
  );
}
