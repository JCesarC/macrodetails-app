import { cacheLife, cacheTag } from 'next/cache';
import {
  ProductPageSchema,
  ProductSchema,
  VendorListSchema,
  type Product,
  type ProductListQuery,
  type ProductPage,
  type Vendor,
} from '@macrodetails/contracts';
import { apiGet, isNotFound } from './client';

/** Catalog data changes rarely, so it is cached for minutes and tagged for on-demand revalidation. */
export const CATALOG_TAG = 'catalog';

export type ProductFilters = Partial<ProductListQuery>;

export async function listProducts(filters: ProductFilters = {}): Promise<ProductPage> {
  'use cache';
  cacheLife('minutes');
  cacheTag(CATALOG_TAG);

  return apiGet('/products', ProductPageSchema, filters);
}

/** Returns null when the product does not exist (404). */
export async function getProduct(slug: string): Promise<Product | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(CATALOG_TAG, `product:${slug}`);

  try {
    return await apiGet(`/products/${encodeURIComponent(slug)}`, ProductSchema);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function listVendors(): Promise<Vendor[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(CATALOG_TAG);

  const { items } = await apiGet('/vendors', VendorListSchema);
  return items;
}
