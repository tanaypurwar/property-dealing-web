import type { CollectionEntry } from 'astro:content';
import { formatAreaRange } from './format';
import { slugify, unitKind, type ListingItem } from './project-filters';

export type Project = CollectionEntry<'projects'>['data'];

/** "2, 3 BHK", "4 BHK", or "Shop, Office" for non-BHK units. */
export function configurationSummary(configs: Project['configurations']): string {
  const kinds = [...new Set(configs.map((c) => unitKind(c.type)))];
  if (kinds.every((k) => /^\d+$/.test(k))) {
    return `${kinds.sort((a, b) => Number(a) - Number(b)).join(', ')} BHK`;
  }
  return [...new Set(configs.map((c) => c.type))].join(', ');
}

/** Smallest to largest carpet area across all configurations. */
export function carpetAreaSummary(configs: Project['configurations']): string {
  const min = Math.min(...configs.map((c) => c.carpetArea.min));
  const max = Math.max(...configs.map((c) => c.carpetArea.max));
  return formatAreaRange(min, max);
}

export const projectUrl = (slug: string) => `/projects/${slug}`;

export function toListingItem(p: Project): ListingItem {
  return {
    slug: p.slug,
    location: slugify(p.location.sector),
    type: p.type,
    status: p.status,
    units: p.configurations.map((c) => ({ kind: unitKind(c.type), min: c.price.min, max: c.price.max })),
    priceMin: p.priceRange.min,
    priceMax: p.priceRange.max,
    listedAt: p.listedAt.getTime(),
    possession: p.possessionDate?.getTime() ?? null,
  };
}
