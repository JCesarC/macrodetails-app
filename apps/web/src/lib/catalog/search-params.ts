import { z } from 'zod';
import {
  CategorySchema,
  OccasionSchema,
  ProductSortSchema,
  SlugSchema,
  type Category,
  type Occasion,
  type ProductSort,
} from '@macrodetails/contracts';

export const CATALOG_PAGE_SIZE = 12;

export interface CatalogFilters {
  q?: string;
  category?: Category;
  occasion?: Occasion;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: ProductSort;
  page: number;
}

export type RawSearchParams = Record<string, string | string[] | undefined>;

const DEFAULT_SORT: ProductSort = 'relevance';

const FIELD_SCHEMAS = {
  q: z.string().trim().min(1).max(100),
  category: CategorySchema,
  occasion: OccasionSchema,
  vendor: SlugSchema,
  minPrice: z.coerce.number().int().nonnegative(),
  maxPrice: z.coerce.number().int().nonnegative(),
  sort: ProductSortSchema,
  page: z.coerce.number().int().min(1),
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseField<K extends keyof typeof FIELD_SCHEMAS>(
  params: RawSearchParams,
  key: K,
): z.infer<(typeof FIELD_SCHEMAS)[K]> | undefined {
  const result = FIELD_SCHEMAS[key].safeParse(first(params[key]));
  return result.success ? (result.data as z.infer<(typeof FIELD_SCHEMAS)[K]>) : undefined;
}

/**
 * Turns URL search params into catalog filters. Invalid values are dropped instead of failing,
 * so a hand-edited or outdated link still shows a useful catalog.
 */
export function parseCatalogSearchParams(params: RawSearchParams): CatalogFilters {
  let minPrice = parseField(params, 'minPrice');
  let maxPrice = parseField(params, 'maxPrice');
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  return {
    q: parseField(params, 'q'),
    category: parseField(params, 'category'),
    occasion: parseField(params, 'occasion'),
    vendor: parseField(params, 'vendor'),
    minPrice,
    maxPrice,
    sort: parseField(params, 'sort') ?? DEFAULT_SORT,
    page: parseField(params, 'page') ?? 1,
  };
}

/**
 * Builds a catalog URL from the current filters plus some changes. Any change other than the page
 * sends the user back to page 1; default values are left out to keep links short and canonical.
 */
export function catalogHref(
  current: CatalogFilters,
  changes: Partial<CatalogFilters> = {},
): string {
  const next: CatalogFilters = { ...current, page: 1, ...changes };
  const params = new URLSearchParams();

  if (next.q) params.set('q', next.q);
  if (next.category) params.set('category', next.category);
  if (next.occasion) params.set('occasion', next.occasion);
  if (next.vendor) params.set('vendor', next.vendor);
  if (next.minPrice !== undefined) params.set('minPrice', String(next.minPrice));
  if (next.maxPrice !== undefined) params.set('maxPrice', String(next.maxPrice));
  if (next.sort !== DEFAULT_SORT) params.set('sort', next.sort);
  if (next.page > 1) params.set('page', String(next.page));

  const query = params.toString();
  return query ? `/products?${query}` : '/products';
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return Boolean(
    filters.q ||
    filters.category ||
    filters.occasion ||
    filters.vendor ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined,
  );
}
