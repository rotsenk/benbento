import { useEffect, useState } from 'react';
import type { Theme } from './uiSlice';

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useEffectiveTheme(theme: Theme): 'light' | 'dark' {
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches);

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
}
