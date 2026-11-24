import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { ProductSummary } from '@macrodetails/contracts';
import { formatMessage, getMessages } from '@/i18n';
import { formatPrice } from '@/lib/format';
import { ProductImage } from './product-image';

interface ProductCardProps {
  product: ProductSummary;
  /** Set on the first cards above the fold to load their image eagerly. */
  priority?: boolean;
}

/**
 * Catalog card linking to a product's detail page.
 * Shows the cover image with the preparation time as a badge, the vendor, a name
 * clamped to two reserved lines so prices align across a row, and the starting price.
 * @param product Product summary to display.
 * @param priority Loads the image eagerly; use it only for cards above the fold.
 */
export function ProductCard({ product, priority }: ProductCardProps) {
  const { product: t } = getMessages().catalog;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card transition-[box-shadow,transform,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg active:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative">
        <ProductImage
          image={product.images[0]}
          category={product.category}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className="aspect-square transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground shadow-sm backdrop-blur-sm">
          <Clock className="size-3" aria-hidden />
          {formatReadyIn(product.leadTimeHours, t)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="truncate text-xs text-muted-foreground">
          {formatMessage(t.by, { vendor: product.vendor.name })}
        </p>
        <h3 className="line-clamp-2 min-h-10 text-sm leading-5 font-medium transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-auto pt-1 text-base font-semibold tabular-nums">
          {formatMessage(t.fromPrice, { price: formatPrice(product.price) })}
        </p>
      </div>
    </Link>
  );
}

function formatReadyIn(hours: number, t: { readyIn: string; readyInDays: string }): string {
  return hours >= 48
    ? formatMessage(t.readyInDays, { days: Math.round(hours / 24) })
    : formatMessage(t.readyIn, { hours });
}
