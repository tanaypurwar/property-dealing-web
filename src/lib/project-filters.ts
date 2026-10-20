/**
 * Filter and sort rules for the /projects listing. Shared by the page (to build the
 * options and the initial order) and the browser script (to filter without a reload).
 * Keep this file free of `astro:` imports so it can run in the browser.
 */
import { formatPrice, formatPriceRange } from './format';

const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

export const TYPE_LABELS = {
  residential: 'Residential',
  commercial: 'Commercial',
  plot: 'Plot',
  'pg-rental': 'PG / rental',
} as const;

export const STATUS_LABELS = {
  upcoming: 'Upcoming',
  'under-construction': 'Under construction',
  'ready-to-move': 'Ready to move',
} as const;

export type ProjectType = keyof typeof TYPE_LABELS;
export type ProjectStatus = keyof typeof STATUS_LABELS;

export const UNIT_OPTIONS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: 'shop', label: 'Shop' },
  { value: 'office', label: 'Office' },
] as const;

/** Upper bound is exclusive: a ₹1 Cr unit is in "₹1–2 Cr", not "₹50 Lakh – ₹1 Cr". */
export const BUDGETS = [
  { value: 'under-50l', label: `Under ${formatPrice(50 * LAKH)}`, min: 0, max: 50 * LAKH },
  { value: '50l-1cr', label: formatPriceRange(50 * LAKH, CRORE), min: 50 * LAKH, max: CRORE },
  { value: '1-2cr', label: formatPriceRange(CRORE, 2 * CRORE), min: CRORE, max: 2 * CRORE },
  { value: 'above-2cr', label: `Above ${formatPrice(2 * CRORE)}`, min: 2 * CRORE, max: Infinity },
] as const;

export const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'possession', label: 'Possession: soonest' },
] as const;

export type Sort = (typeof SORTS)[number]['value'];
export const DEFAULT_SORT: Sort = 'newest';

/** "2BHK" → "2", "3BHK 2T" → "3", "Shop" → "shop". Matches UNIT_OPTIONS values. */
export function unitKind(type: string): string {
  return /^(\d+)\s*BHK\b/i.exec(type.trim())?.[1] ?? type.trim().toLowerCase();
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** The minimum the browser needs to filter and sort one project. */
export interface ListingItem {
  slug: string;
  location: string;
  type: ProjectType;
  status: ProjectStatus;
  units: { kind: string; min: number; max: number }[];
  priceMin: number;
  priceMax: number;
  listedAt: number;
  possession: number | null;
}

export interface FilterState {
  location: string;
  type: string;
  status: string;
  bhk: string;
  budget: string;
  sort: Sort;
}

export const FILTER_KEYS = ['location', 'type', 'status', 'bhk', 'budget'] as const;

export function activeFilterCount(state: FilterState): number {
  return FILTER_KEYS.filter((k) => state[k] !== '').length;
}

/**
 * A project matches when at least one of its unit types satisfies both the
 * configuration and budget filters, so "3 BHK under ₹1 Cr" doesn't match a
 * project whose 2 BHKs are under ₹1 Cr but whose 3 BHKs aren't.
 */
export function matches(item: ListingItem, state: FilterState): boolean {
  if (state.location && item.location !== state.location) return false;
  if (state.type && item.type !== state.type) return false;
  if (state.status && item.status !== state.status) return false;

  const band = BUDGETS.find((b) => b.value === state.budget);
  return item.units.some(
    (u) =>
      (!state.bhk || u.kind === state.bhk) &&
      (!band || (u.min < band.max && u.max >= band.min)),
  );
}

export function compare(sort: Sort): (a: ListingItem, b: ListingItem) => number {
  switch (sort) {
    case 'price-asc':
      return (a, b) => a.priceMin - b.priceMin;
    case 'price-desc':
      return (a, b) => b.priceMax - a.priceMax;
    case 'possession':
      // Ready-to-move (past dates) first, projects without a date last.
      return (a, b) => (a.possession ?? Infinity) - (b.possession ?? Infinity);
    default:
      return (a, b) => b.listedAt - a.listedAt;
  }
}

/** Reads filters from a query string, dropping anything that isn't a known option. */
export function parseState(params: URLSearchParams, locations: string[]): FilterState {
  const pick = (key: string, allowed: readonly string[]) => {
    const v = params.get(key) ?? '';
    return allowed.includes(v) ? v : '';
  };
  const sort = pick('sort', SORTS.map((s) => s.value));
  return {
    location: pick('location', locations),
    type: pick('type', Object.keys(TYPE_LABELS)),
    status: pick('status', Object.keys(STATUS_LABELS)),
    bhk: pick('bhk', UNIT_OPTIONS.map((o) => o.value)),
    budget: pick('budget', BUDGETS.map((b) => b.value)),
    sort: (sort || DEFAULT_SORT) as Sort,
  };
}

export function toQuery(state: FilterState): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) if (state[key]) params.set(key, state[key]);
  if (state.sort !== DEFAULT_SORT) params.set('sort', state.sort);
  const query = params.toString();
  return query ? `?${query}` : '';
}
