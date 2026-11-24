import type { ProductSummary } from '@macrodetails/contracts';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from './product-card';

const GRID_CLASSES =
  'grid grid-cols-2 gap-3 @xl:gap-4 @2xl:grid-cols-3 @4xl:grid-cols-4 @4xl:gap-5';

/**
 * Responsive grid of product cards.
 * Columns follow the width of the grid's container, not the viewport, so the
 * same grid fits a full-width home section and the catalog next to its filters.
 * @param products Products to render, in display order. The first four load their image eagerly.
 */
export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div className="@container">
      <ul className={GRID_CLASSES}>
        {products.map((product, index) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} priority={index < 4} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Loading placeholder that mirrors the layout of {@link ProductGrid}.
 * @param count Number of placeholder cards. Defaults to 8.
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="@container" aria-hidden>
      <ul className={GRID_CLASSES}>
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="flex flex-col gap-2">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </li>
        ))}
      </ul>
    </div>
  );
}
