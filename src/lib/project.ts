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
  return c.carpetArea
    ? { label: 'Carpet area', value: formatAreaRange(c.carpetArea.min, c.carpetArea.max) }
    : { label: 'Saleable area', value: formatAreaRange(c.saleableArea!.min, c.saleableArea!.max) };
}

/** Smallest to largest area across configurations: carpet if every unit has it, else saleable. */
export function areaSummary(configs: Configuration[]): { label: string; value: string } {
  const useCarpet = configs.every((c) => c.carpetArea);
  const ranges = configs.map((c) => (useCarpet ? c.carpetArea : (c.saleableArea ?? c.carpetArea))!);
  return {
    label: useCarpet ? 'Carpet area' : 'Saleable area',
    value: formatAreaRange(Math.min(...ranges.map((r) => r.min)), Math.max(...ranges.map((r) => r.max))),
  };
}

/** Short note shown beside a price: "all-inclusive", or "BSP, plus charges" for base prices. */
export function priceLabel(p: Pick<Project, 'priceBasis'>): string {
  return p.priceBasis === 'all-inclusive' ? 'all-inclusive' : 'BSP, taxes and charges extra';
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
