import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';

interface Props {
  isOpen: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function Dialog({
  isOpen,
  title,
  closeLabel,
  onClose,
  triggerRef,
  children,
}: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const root = document.getElementById('root');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      root?.setAttribute('inert', '');
    } else {
      document.body.style.overflow = '';
      root?.removeAttribute('inert');
    }

    return () => {
      document.body.style.overflow = '';
      root?.removeAttribute('inert');
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      return;
    }

    if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (!focusable || focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className={[
          'w-full max-w-lg max-h-[min(88dvh,760px)] overflow-y-auto',
          'rounded-t-3xl sm:rounded-3xl',
          'border border-line bg-surface text-ink',
          'p-5 sm:p-6',
          'shadow-[0_12px_40px_rgb(0_0_0/0.18)]',
          'animate-[dialogIn_180ms_ease-out]',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl sm:text-2xl font-semibold">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors duration-150 hover:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <X size={20} aria-hidden weight="regular" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
