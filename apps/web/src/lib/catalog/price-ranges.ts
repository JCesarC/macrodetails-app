export const PRICE_RANGES = [
  { key: 'under-300', minPrice: undefined, maxPrice: 30_000 },
  { key: '300-600', minPrice: 30_000, maxPrice: 60_000 },
  { key: '600-1000', minPrice: 60_000, maxPrice: 100_000 },
  { key: 'over-1000', minPrice: 100_000, maxPrice: undefined },
] as const;

export type PriceRange = (typeof PRICE_RANGES)[number];
export type PriceRangeKey = PriceRange['key'];

export function findPriceRange(minPrice?: number, maxPrice?: number): PriceRange | undefined {
  return PRICE_RANGES.find((range) => range.minPrice === minPrice && range.maxPrice === maxPrice);
}
