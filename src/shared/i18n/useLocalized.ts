import { useCallback } from 'react';
import { useAppSelector } from '@/app/hooks';
import type { Localized } from './types';

export function useLocalized() {
  const locale = useAppSelector((state) => state.ui.locale);

  return useCallback(
    <T,>(value: Localized<T>): T => value[locale],
    [locale],
  );
}
