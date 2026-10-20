/** Helpers for the project detail page: icons for free-text data, YouTube ids, nearby grouping. */
import type { IconName } from '../components/Icon.astro';
import type { Project } from './project';

/** First match wins, so put specific words before general ones. */
const AMENITY_ICONS: [RegExp, IconName][] = [
  [/pool|swim/i, 'pool'],
  [/gym|fitness/i, 'gym'],
  [/parking|\bcar\b/i, 'parking'],
  [/yoga|meditation|garden|lawn|\bpark\b|green/i, 'leaf'],
  [/play|kids|children/i, 'play2'],
  [/jog|walk|track|cycl/i, 'track'],
  [/cctv|camera/i, 'cctv'],
  [/secur|guard|gated/i, 'shield'],
  [/ev |ev$|charging/i, 'plug'],
  [/power|backup|electric/i, 'bolt'],
  [/lift|elevator/i, 'lift'],
  [/squash|badminton|tennis|court|sport|cricket|basketball/i, 'ball'],
  [/work|business centre|business center/i, 'laptop'],
  [/food|restaurant|cafe|café|dining/i, 'food'],
  [/fire/i, 'flame'],
  [/air.?condition|hvac|\bac\b/i, 'snow'],
  [/banquet|party|event/i, 'party'],
  [/club/i, 'building'],
];

export function amenityIcon(name: string): IconName {
  return AMENITY_ICONS.find(([re]) => re.test(name))?.[1] ?? 'check';
}

type NearbyCategory = Project['nearby'][number]['category'];

/** Display order: the categories buyers ask about first. */
export const NEARBY_CATEGORIES: { key: NearbyCategory; label: string; icon: IconName }[] = [
  { key: 'metro', label: 'Metro', icon: 'metro' },
  { key: 'highway', label: 'Highways', icon: 'highway' },
  { key: 'school', label: 'Schools', icon: 'school' },
  { key: 'hospital', label: 'Hospitals', icon: 'hospital' },
  { key: 'mall', label: 'Shopping', icon: 'mall' },
];

export function groupNearby(nearby: Project['nearby']) {
  return NEARBY_CATEGORIES.map((c) => ({
    ...c,
    places: nearby.filter((n) => n.category === c.key).sort((a, b) => a.distanceKm - b.distanceKm),
  })).filter((g) => g.places.length > 0);
}

/** "https://youtu.be/abc" or "https://www.youtube.com/watch?v=abc" → "abc" */
export function youtubeId(url: string): string | undefined {
  return /(?:youtu\.be\/|[?&]v=)([\w-]{11})/.exec(url)?.[1];
}

/** Other published projects, best matches first: same type and area, then same type, then same area. */
export function similarProjects(current: Project, all: Project[], limit = 3): Project[] {
  const score = (p: Project) =>
    (p.type === current.type ? 2 : 0) + (p.location.sector === current.location.sector ? 1 : 0);
  return all
    .filter((p) => p.slug !== current.slug && score(p) > 0)
    .sort((a, b) => score(b) - score(a) || b.listedAt.getTime() - a.listedAt.getTime())
    .slice(0, limit);
}
