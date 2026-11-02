import { Moon, Sun } from '@phosphor-icons/react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ui } from '@/content/ui';
import { setLocale, setTheme } from '@/features/ui/uiSlice';
import { useEffectiveTheme } from '@/features/ui/useEffectiveTheme';
import { useLocalized } from '@/shared/i18n/useLocalized';

interface Props {
  name: string;
}

export function Header({ name }: Props) {
  const dispatch = useAppDispatch();
  const localize = useLocalized();
  const locale = useAppSelector((state) => state.ui.locale);
  const theme = useAppSelector((state) => state.ui.theme);
  const effectiveTheme = useEffectiveTheme(theme);
  const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';

  return (
    <header className="border-b border-line bg-bg pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <p className="min-w-0 truncate font-display text-sm font-semibold sm:text-base">{name}</p>

        <div className="flex shrink-0 items-center gap-2">
          <div
            role="group"
            aria-label={localize(ui.header.languageLabel)}
            className="inline-flex items-center rounded-full border border-line bg-surface p-0.5"
          >
            <button
              type="button"
              lang="es"
              aria-label={`ES - ${localize(ui.header.spanish)}`}
              aria-pressed={locale === 'es'}
              onClick={() => dispatch(setLocale('es'))}
              className={[
                'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 font-mono text-xs font-medium transition-colors duration-150',
                locale === 'es' ? 'bg-ink text-bg' : 'text-ink-muted hover:text-ink',
                'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
              ].join(' ')}
            >
              ES
            </button>
            <button
              type="button"
              lang="en"
              aria-label={`EN - ${localize(ui.header.english)}`}
              aria-pressed={locale === 'en'}
              onClick={() => dispatch(setLocale('en'))}
              className={[
                'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 font-mono text-xs font-medium transition-colors duration-150',
                locale === 'en' ? 'bg-ink text-bg' : 'text-ink-muted hover:text-ink',
                'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
              ].join(' ')}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => dispatch(setTheme(nextTheme))}
            aria-label={
              nextTheme === 'dark'
                ? localize(ui.header.switchToDark)
                : localize(ui.header.switchToLight)
            }
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors duration-150 hover:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {effectiveTheme === 'dark' ? (
              <Sun size={20} aria-hidden />
            ) : (
              <Moon size={20} aria-hidden />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
