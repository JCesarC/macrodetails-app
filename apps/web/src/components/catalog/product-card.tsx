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

export function ProductCard({ product, priority }: ProductCardProps) {
  const { product: t } = getMessages().catalog;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <ProductImage
        image={product.images[0]}
        category={product.category}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        priority={priority}
        className="aspect-square transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-muted-foreground">
          {formatMessage(t.by, { vendor: product.vendor.name })}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium text-pretty">{product.name}</h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-2">
          <span className="font-semibold">
            {formatMessage(t.fromPrice, { price: formatPrice(product.price) })}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" aria-hidden />
            {formatReadyIn(product.leadTimeHours, t)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatReadyIn(hours: number, t: { readyIn: string; readyInDays: string }): string {
  return hours >= 48
    ? formatMessage(t.readyInDays, { days: Math.round(hours / 24) })
    : formatMessage(t.readyIn, { hours });
}
