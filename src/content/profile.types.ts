import type { Localized } from '@/shared/i18n/types';

export type TileSize = '1x1' | '2x1' | '1x2' | '2x2';

interface BaseTile {
  id: string;
  enabled: boolean;
}

interface GridTile extends BaseTile {
  size: TileSize;
}

export type LinkPlatform = 'linkedin' | 'github' | 'x' | 'email' | 'other';

export interface ImageRef {
  src: string;
  alt: Localized;
  width: number;
  height: number;
}

export interface Milestone {
  period: string;
  role: Localized;
  place: string;
  detail?: Localized;
}

export interface Hobby {
  label: Localized;
  icon: string;
}

export interface ProjectItem {
  name: string;
  summary: Localized;
  href?: string;
}

export type Tile =
  | (BaseTile & {
      type: 'avatar';
      image: ImageRef;
    })
  | (GridTile & {
      type: 'identity';
      name: string;
      headline: Localized;
      bio: Localized;
    })
  | (GridTile & {
      type: 'specialty';
      title: Localized;
      chips: string[];
      portfolio?: {
        label: Localized;
        href: string;
      };
    })
  | (GridTile & {
      type: 'experience';
      summary: Milestone[];
      timeline: Milestone[];
    })
  | (GridTile & {
      type: 'link';
      platform: LinkPlatform;
      label: string;
      handle: string;
      href: string;
    })
  | (GridTile & {
      type: 'spotify';
      title: Localized;
      playlistId: string;
      href: string;
    })
  | (GridTile & {
      type: 'photo';
      image: ImageRef;
      caption: Localized;
    })
  | (GridTile & {
      type: 'top-list';
      title: Localized;
      items: [string, string, string,];
    })
  | (GridTile & {
      type: 'hobbies';
      title: Localized;
      items: [Hobby, Hobby];
    })
  | (GridTile & {
      type: 'projects';
      title: Localized;
      items: ProjectItem[];
    })
  | (GridTile & {
      type: 'contact';
      title: Localized;
      email: string;
      href: string;
    })
  | (GridTile & {
      type: 'now';
      title: Localized;
      body: Localized;
    })
  | (GridTile & {
      type: 'availability';
      title: Localized;
      timezone: string;
      modes: Localized[];
    });

export interface BentoDocument {
  version: 1;
  tiles: Tile[];
}
