/**
 * Display formatting for prices and areas. All prices on the site go through
 * these helpers so the Lakh/Cr rules live in one place.
 */

const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

const indian = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** Up to two decimals, trailing zeros dropped: 1.20 → "1.2", 45.00 → "45". */
const short = (n: number) => String(Math.round(n * 100) / 100);

type Unit = 'Cr' | 'Lakh' | '';

function split(rupees: number): { value: string; unit: Unit } {
  // Round in lakh first, so ₹99.999 Lakh becomes ₹1 Cr rather than ₹100 Lakh.
  const lakh = Math.round((rupees / LAKH) * 100) / 100;
  if (lakh >= 100) return { value: short(rupees / CRORE), unit: 'Cr' };
  if (rupees >= LAKH) return { value: short(lakh), unit: 'Lakh' };
  return { value: indian.format(rupees), unit: '' };
}

const join = ({ value, unit }: { value: string; unit: Unit }) =>
  unit ? `₹${value} ${unit}` : `₹${value}`;

/** 4500000 → "₹45 Lakh", 12000000 → "₹1.2 Cr", 18500 → "₹18,500". */
export function formatPrice(rupees: number): string {
  return join(split(rupees));
}

/** "₹45–60 Lakh" when both ends share a unit, otherwise "₹78 Lakh – ₹1.1 Cr". */
export function formatPriceRange(min: number, max: number): string {
  const a = split(min);
  const b = split(max);
  if (a.value === b.value && a.unit === b.unit) return join(a);
  if (a.unit === b.unit && a.unit) return `₹${a.value}–${b.value} ${a.unit}`;
  return `${join(a)} – ${join(b)}`;
}

/** 1650 → "1,650 sq. ft." */
export function formatArea(sqft: number): string {
  return `${indian.format(sqft)} sq. ft.`;
}

/** "1,150–1,650 sq. ft." */
export function formatAreaRange(min: number, max: number): string {
  if (min === max) return formatArea(min);
  return `${indian.format(min)}–${indian.format(max)} sq. ft.`;
}

/** "Dec 2027", "Sep 2027" (en-US gives three-letter months; en-IN gives "Sept"). */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
}
