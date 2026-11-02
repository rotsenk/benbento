import { useEffect, useState } from 'react';
import { ProfileProvider } from '@/features/profile-grid/model/ProfileProvider';
import { useProfile } from '@/features/profile-grid/model/profileContext';
import { Header } from '@/features/profile-grid/Header';
import { ProfileGrid } from '@/features/profile-grid/ProfileGrid';
import { useAppSelector } from '@/app/hooks';
import { ui } from '@/content/ui';
import { useEffectiveTheme } from '@/features/ui/useEffectiveTheme';
import { localeUrl } from '@/shared/i18n/locale';
import { useLocalized } from '@/shared/i18n/useLocalized';

function BentoPage() {
  const { document: profileDocument } = useProfile();
  const locale = useAppSelector((state) => state.ui.locale);
  const theme = useAppSelector((state) => state.ui.theme);
  const effectiveTheme = useEffectiveTheme(theme);
  const localize = useLocalized();
  const [announcement, setAnnouncement] = useState('');

  const identity = profileDocument.tiles.find((tile) => tile.type === 'identity');
  const name = identity && identity.type === 'identity' ? identity.name : '';

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
  }, [effectiveTheme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = localize(ui.pageTitle);

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.append(description);
    }
    description.setAttribute('content', localize(ui.metaDescription));

    const nextUrl = localeUrl(locale);
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, '', nextUrl);
    }

    setAnnouncement(localize(ui.a11y.languageChanged));
  }, [locale, localize]);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] inline-flex min-h-11 -translate-y-24 items-center rounded-xl bg-ink px-4 text-sm font-medium text-bg transition-transform duration-150 focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {localize(ui.a11y.skipToContent)}
      </a>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <Header name={name} />
      <ProfileGrid />
    </div>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <BentoPage />
    </ProfileProvider>
  );
}
