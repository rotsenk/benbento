import { useMemo, useReducer, type ReactNode } from 'react';
import profile from '@/content/profile';
import type { BentoDocument } from '@/content/profile.types';
import { ProfileContext } from './profileContext';
import { profileReducer } from './profileReducer';

interface Props {
  initialDocument?: BentoDocument;
  children: ReactNode;
}

export function ProfileProvider({ initialDocument = profile, children }: Props) {
  const [document, dispatch] = useReducer(profileReducer, initialDocument);
  const value = useMemo(() => ({ document, dispatch }), [document]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
