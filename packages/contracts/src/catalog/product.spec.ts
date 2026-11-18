import { describe, expect, it } from 'vitest';
import { ProductListQuerySchema } from './product.js';

describe('ProductListQuerySchema', () => {
  it('applies defaults and coerces query-string numbers', () => {
    const query = ProductListQuerySchema.parse({ page: '2', maxPrice: '80000' });

    expect(query).toEqual({ page: 2, limit: 12, maxPrice: 80000, sort: 'relevance' });
  });

  it('rejects an unknown category', () => {
    expect(ProductListQuerySchema.safeParse({ category: 'cars' }).success).toBe(false);
  });

  it('rejects a price range where min is greater than max', () => {
    const result = ProductListQuerySchema.safeParse({ minPrice: '500', maxPrice: '100' });

    expect(result.success).toBe(false);
  });

  it('caps the page size', () => {
    expect(ProductListQuerySchema.safeParse({ limit: '500' }).success).toBe(false);
  });
});
