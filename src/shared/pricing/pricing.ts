/** Converts a dollar amount from the API to whole cents. */
export function dollarsToCents(dollars: number): number {
  // toFixed first absorbs float noise such as 1.005 * 100 = 100.49999999999999.
  return Math.round(Number((dollars * 100).toFixed(6)))
}

/** Formats whole cents as dollars with two decimals, e.g. 999 -> "$9.99". */
export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export const MAX_STARS = 5

/** Number of filled stars for a rating out of 5. No half stars. */
export function starCount(rating: number): number {
  return Math.min(MAX_STARS, Math.max(0, Math.round(rating)))
}

/** Discount label with a whole-number percentage, e.g. "10% Off". */
export function discountLabel(discountPercentage: number): string {
  return `${Math.round(discountPercentage)}% Off`
}

/**
 * Price before the discount. The API price is already discounted, so this
 * divides by (1 - discount). Uses the unrounded percentage.
 */
export function originalPriceCents(
  priceCents: number,
  discountPercentage: number,
): number {
  return Math.round(priceCents / (1 - discountPercentage / 100))
}

/** "You Save" for one unit: original price minus discounted price. */
export function savingsCents(
  priceCents: number,
  discountPercentage: number,
): number {
  return originalPriceCents(priceCents, discountPercentage) - priceCents
}
