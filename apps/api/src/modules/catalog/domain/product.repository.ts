import type {
  ProductRecord,
  ProductSearchCriteria,
  ProductSearchResult,
} from './product-record.js';

/** Port: product persistence. Only active products are ever returned. */
export abstract class ProductRepository {
  abstract search(criteria: ProductSearchCriteria): Promise<ProductSearchResult>;
  abstract findBySlug(slug: string): Promise<ProductRecord | null>;
}
