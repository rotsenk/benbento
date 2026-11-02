import type { Tile } from '@/content/profile.types';
import { ui } from '@/content/ui';
import { useLocalized } from '@/shared/i18n/useLocalized';
import { hasRequiredFields } from './model/validateTile';
import { useProfile } from './model/profileContext';
import { ProfileAvatar } from './ProfileAvatar';
import { AvailabilityTile } from './tiles/AvailabilityTile';
import { ContactTile } from './tiles/ContactTile';
import { ExperienceTile } from './tiles/ExperienceTile';
import { HobbiesTile } from './tiles/HobbiesTile';
import { IdentityTile } from './tiles/IdentityTile';
import { LinkTile } from './tiles/LinkTile';
import { NowTile } from './tiles/NowTile';
import { PhotoTile } from './tiles/PhotoTile';
import { ProjectsTile } from './tiles/ProjectsTile';
import { SpecialtyTile } from './tiles/SpecialtyTile';
import { SpotifyTile } from './tiles/SpotifyTile';
import { TopListTile } from './tiles/TopListTile';

type AvatarTile = Extract<Tile, { type: 'avatar' }>;
type GridTile = Exclude<Tile, { type: 'avatar' }>;

const WIDE_ON_DESKTOP_TILE_IDS = new Set(['pet']);

function TileRenderer({ tile }: { tile: GridTile }) {
  const localize = useLocalized();

  switch (tile.type) {
    case 'identity':
      return (
        <IdentityTile
          id={tile.id}
          size={tile.size}
          name={tile.name}
          headline={localize(tile.headline)}
          bio={localize(tile.bio)}
        />
      );
    case 'specialty':
      return (
        <SpecialtyTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          chips={tile.chips}
          portfolio={
            tile.portfolio
              ? {
                  label: localize(tile.portfolio.label),
                  href: tile.portfolio.href,
                }
              : undefined
          }
        />
      );
    case 'experience': {
      const milestones = (items: typeof tile.summary) =>
        items.map((milestone) => ({
          period: milestone.period,
          role: localize(milestone.role),
          place: milestone.place,
          detail: milestone.detail ? localize(milestone.detail) : undefined,
        }));

      return (
        <ExperienceTile
          id={tile.id}
          size={tile.size}
          summary={milestones(tile.summary)}
          timeline={milestones(tile.timeline)}
        />
      );
    }
    case 'link':
      return (
        <LinkTile
          id={tile.id}
          size={tile.size}
          platform={tile.platform}
          label={tile.label}
          handle={tile.handle}
          href={tile.href}
        />
      );
    case 'spotify':
      return (
        <SpotifyTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          playlistId={tile.playlistId}
          href={tile.href}
        />
      );
    case 'photo':
      return (
        <PhotoTile
          id={tile.id}
          size={tile.size}
          caption={localize(tile.caption)}
          image={{
            src: tile.image.src,
            alt: localize(tile.image.alt),
            width: tile.image.width,
            height: tile.image.height,
          }}
          wideOnDesktop={WIDE_ON_DESKTOP_TILE_IDS.has(tile.id)}
        />
      );
    case 'top-list':
      return (
        <TopListTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          items={tile.items}
        />
      );
    case 'hobbies':
      return (
        <HobbiesTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          items={tile.items.map((hobby) => ({
            label: localize(hobby.label),
            icon: hobby.icon,
          }))}
        />
      );
    case 'projects':
      return (
        <ProjectsTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          items={tile.items.map((project) => ({
            name: project.name,
            summary: localize(project.summary),
            href: project.href,
          }))}
        />
      );
    case 'contact':
      return (
        <ContactTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          email={tile.email}
          href={tile.href}
        />
      );
    case 'now':
      return (
        <NowTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          body={localize(tile.body)}
        />
      );
    case 'availability':
      return (
        <AvailabilityTile
          id={tile.id}
          size={tile.size}
          title={localize(tile.title)}
          timezone={tile.timezone}
          modes={tile.modes.map(localize)}
        />
      );
  }
}

export function ProfileGrid() {
  const { document } = useProfile();
  const localize = useLocalized();
  const visibleTiles = document.tiles.filter((tile) => {
    if (!tile.enabled) return false;
    if (!hasRequiredFields(tile)) {
      if (import.meta.env.DEV) {
        console.warn(`[bento] Tile omitido por datos incompletos: ${tile.id}`);
      }
      return false;
    }
    return true;
  });
  const avatar = visibleTiles.find((tile): tile is AvatarTile => tile.type === 'avatar');
  const gridTiles = visibleTiles.filter((tile): tile is GridTile => tile.type !== 'avatar');
  const identity = gridTiles.find((tile) => tile.type === 'identity');
  const name = identity?.type === 'identity' ? identity.name : '';

  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label={localize(ui.a11y.profileGrid)}
      className="mx-auto w-full max-w-[1120px] px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8"
    >
      {avatar ? (
        <div className="mb-4 flex justify-center sm:mb-6 sm:justify-start">
          <ProfileAvatar
            name={name}
            image={{
              src: avatar.image.src,
              alt: localize(avatar.image.alt),
              width: avatar.image.width,
              height: avatar.image.height,
            }}
          />
        </div>
      ) : null}

      <div
        data-profile-grid
        className="grid grid-cols-1 gap-3 sm:auto-rows-[minmax(140px,auto)] sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
      >
        {gridTiles.map((tile) => (
          <TileRenderer key={tile.id} tile={tile} />
        ))}
      </div>
    </main>
  );
}
