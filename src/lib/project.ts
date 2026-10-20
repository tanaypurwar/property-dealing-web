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

type Configuration = Project['configurations'][number];

/**
 * The area to show for one configuration: carpet area when known, otherwise saleable
 * area, always labelled so the two are never confused.
 */
export function unitArea(c: Configuration): { label: string; value: string } {
  if (c.carpetArea) return { label: 'Carpet area', value: formatAreaRange(c.carpetArea.min, c.carpetArea.max) };
  if (c.saleableArea) return { label: 'Saleable area', value: formatAreaRange(c.saleableArea.min, c.saleableArea.max) };
  return { label: 'Area', value: 'On request' };
}

/**
 * Smallest to largest area across configurations: carpet if every unit has it, else
 * saleable (falling back to carpet), skipping units whose area isn't known yet.
 */
export function areaSummary(configs: Configuration[]): { label: string; value: string } {
  const useCarpet = configs.every((c) => c.carpetArea);
  const ranges = configs
    .map((c) => (useCarpet ? c.carpetArea : (c.saleableArea ?? c.carpetArea)))
    .filter((r) => r !== undefined);
  if (ranges.length === 0) return { label: 'Area', value: 'On request' };
  return {
    label: useCarpet ? 'Carpet area' : 'Saleable area',
    value: formatAreaRange(Math.min(...ranges.map((r) => r.min)), Math.max(...ranges.map((r) => r.max))),
  };
}

/** Short note shown beside a price, so a figure is never read as more than it is. */
export function priceLabel(p: Pick<Project, 'priceBasis'>): string {
  return {
    'all-inclusive': 'all-inclusive',
    base: 'BSP, taxes and charges extra',
    indicative: 'starting prices, to be confirmed',
  }[p.priceBasis];
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
