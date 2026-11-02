import type { Hobby, ImageRef, Milestone, ProjectItem, Tile } from '@/content/profile.types';
import type { Localized } from '@/shared/i18n/types';

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function hasLocalized(value: Localized<string> | undefined): boolean {
  if (!value || typeof value !== 'object') return false;
  return hasText(value.es) && hasText(value.en);
}

function hasImage(image: ImageRef | undefined): boolean {
  return Boolean(
    image &&
      hasText(image.src) &&
      isSafeImageSrc(image.src) &&
      hasLocalized(image.alt) &&
      image.width > 0 &&
      image.height > 0,
  );
}

function hasMilestone(milestone: Milestone): boolean {
  return (
    hasText(milestone.period) &&
    hasLocalized(milestone.role) &&
    hasText(milestone.place) &&
    (!milestone.detail || hasLocalized(milestone.detail))
  );
}

function hasHobby(hobby: Hobby): boolean {
  return hasLocalized(hobby.label) && hasText(hobby.icon);
}

function hasProject(project: ProjectItem): boolean {
  return (
    hasText(project.name) &&
    hasLocalized(project.summary) &&
    (!project.href || isSafeHref(project.href))
  );
}

export function isSafeHref(value: string): boolean {
  const href = value.trim();
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href);
}

export function isSafeImageSrc(value: string): boolean {
  const src = value.trim();
  const isLocal = (src.startsWith('/') && !src.startsWith('//')) || src.startsWith('./');
  return isLocal || /^https:\/\//i.test(src);
}

/** Comprueba que un tile tenga todos los campos necesarios para renderizarse. */
export function hasRequiredFields(tile: Tile): boolean {
  switch (tile.type) {
    case 'avatar':
      return hasImage(tile.image);
    case 'identity':
      return hasText(tile.name) && hasLocalized(tile.headline) && hasLocalized(tile.bio);
    case 'specialty':
      return (
        hasLocalized(tile.title) &&
        tile.chips.length > 0 &&
        tile.chips.every(hasText) &&
        (!tile.portfolio ||
          (hasLocalized(tile.portfolio.label) && isSafeHref(tile.portfolio.href)))
      );
    case 'experience':
      return (
        tile.summary.length > 0 &&
        tile.timeline.length > 0 &&
        tile.summary.every(hasMilestone) &&
        tile.timeline.every(hasMilestone)
      );
    case 'link':
      return (
        hasText(tile.platform) &&
        hasText(tile.label) &&
        hasText(tile.handle) &&
        isSafeHref(tile.href)
      );
    case 'spotify':
      return hasLocalized(tile.title) && hasText(tile.playlistId) && isSafeHref(tile.href);
    case 'photo':
      return hasImage(tile.image) && hasLocalized(tile.caption);
    case 'top-list':
      return (
        hasLocalized(tile.title) &&
        tile.items.length === 3 &&
        tile.items.every(hasText)
      );
    case 'hobbies':
      return (
        hasLocalized(tile.title) &&
        tile.items.length === 2 &&
        tile.items.every(hasHobby)
      );
    case 'projects':
      return (
        hasLocalized(tile.title) &&
        tile.items.length >= 1 &&
        tile.items.length <= 2 &&
        tile.items.every(hasProject)
      );
    case 'contact':
      return hasLocalized(tile.title) && hasText(tile.email) && /^mailto:/i.test(tile.href);
    case 'now':
      return hasLocalized(tile.title) && hasLocalized(tile.body);
    case 'availability':
      return (
        hasLocalized(tile.title) &&
        hasText(tile.timezone) &&
        tile.modes.length > 0 &&
        tile.modes.every(hasLocalized)
      );
  }
}
