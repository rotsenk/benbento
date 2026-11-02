import { createContext, useContext, type Dispatch } from 'react';
import type { BentoDocument } from '@/content/profile.types';
import type { ProfileAction } from './profileReducer';

export interface ProfileContextValue {
  document: BentoDocument;
  dispatch: Dispatch<ProfileAction>;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile debe usarse dentro de ProfileProvider.');
  }

  return context;
}
