import type { CollectionEntry } from 'astro:content';
import { formatAreaRange } from './format';

export type Project = CollectionEntry<'projects'>['data'];

/** "2 & 3 BHK", "4 BHK", or "Shop, Office" for non-BHK units. */
export function configurationSummary(configs: Project['configurations']): string {
  const types = [...new Set(configs.map((c) => c.type))];
  const bhk = types.map((t) => /^(\d+(?:\.\d)?)\s*BHK$/i.exec(t)?.[1]);
  if (bhk.every(Boolean)) {
    const nums = (bhk as string[]).sort((a, b) => Number(a) - Number(b));
    const list = nums.length > 1 ? `${nums.slice(0, -1).join(', ')} & ${nums.at(-1)}` : nums[0];
    return `${list} BHK`;
  }
  return types.join(', ');
}

/** Smallest to largest carpet area across all configurations. */
export function carpetAreaSummary(configs: Project['configurations']): string {
  const min = Math.min(...configs.map((c) => c.carpetArea.min));
  const max = Math.max(...configs.map((c) => c.carpetArea.max));
  return formatAreaRange(min, max);
}

export const projectUrl = (slug: string) => `/projects/${slug}`;
