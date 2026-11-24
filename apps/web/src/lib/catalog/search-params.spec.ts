import { describe, expect, it } from 'vitest';
import { catalogHref, hasActiveFilters, parseCatalogSearchParams } from './search-params';

describe('parseCatalogSearchParams', () => {
  it('applies defaults when the URL has no params', () => {
    expect(parseCatalogSearchParams({})).toEqual({ sort: 'relevance', page: 1 });
  });

  it('parses every supported filter', () => {
    expect(
      parseCatalogSearchParams({
        q: ' rosas ',
        category: 'flowers',
        occasion: 'birthday',
        vendor: 'floreria-la-muralla',
        minPrice: '30000',
        maxPrice: '60000',
        sort: 'price-asc',
        page: '2',
      }),
    ).toEqual({
      q: 'rosas',
      category: 'flowers',
      occasion: 'birthday',
      vendor: 'floreria-la-muralla',
      minPrice: 30_000,
      maxPrice: 60_000,
      sort: 'price-asc',
      page: 2,
    });
  });

  it('drops invalid values instead of failing', () => {
    expect(parseCatalogSearchParams({ category: 'cars', page: '-1', sort: 'random' })).toEqual({
      sort: 'relevance',
      page: 1,
    });
  });

  it('uses the first value when a param is repeated', () => {
    expect(parseCatalogSearchParams({ category: ['desserts', 'flowers'] }).category).toBe(
      'desserts',
    );
  });

  it('drops an inverted price range', () => {
    const filters = parseCatalogSearchParams({ minPrice: '60000', maxPrice: '30000' });
    expect(filters.minPrice).toBeUndefined();
    expect(filters.maxPrice).toBeUndefined();
  });
});

describe('catalogHref', () => {
  const base = parseCatalogSearchParams({ category: 'flowers', page: '3' });

  it('resets to the first page when a filter changes', () => {
    expect(catalogHref(base, { occasion: 'birthday' })).toBe(
      '/products?category=flowers&occasion=birthday',
    );
  });

  it('keeps the requested page when only the page changes', () => {
    expect(catalogHref(base, { page: 4 })).toBe('/products?category=flowers&page=4');
  });

  it('removes a filter set to undefined', () => {
    expect(catalogHref(base, { category: undefined })).toBe('/products');
  });

  it('omits default sort and page', () => {
    expect(catalogHref(base, { sort: 'relevance' })).toBe('/products?category=flowers');
  });
});

describe('hasActiveFilters', () => {
  it('ignores sort and page', () => {
    expect(hasActiveFilters(parseCatalogSearchParams({ sort: 'newest', page: '2' }))).toBe(false);
  });

  it('detects a price bound', () => {
    expect(hasActiveFilters(parseCatalogSearchParams({ maxPrice: '30000' }))).toBe(true);
  });
});
