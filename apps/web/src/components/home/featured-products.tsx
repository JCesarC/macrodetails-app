import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductGrid, ProductGridSkeleton } from '@/components/catalog/product-grid';
import { getMessages } from '@/i18n';
import { listProducts } from '@/lib/api/catalog';

const FEATURED_COUNT = 8;

export function FeaturedProducts() {
  const t = getMessages().home.featured;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{t.title}</h2>
        <Link
          href="/products?sort=newest"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {t.seeAll}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <Suspense fallback={<ProductGridSkeleton count={FEATURED_COUNT} />}>
        <FeaturedGrid />
      </Suspense>
    </section>
  );
}

/**
 * Rendered per request: `connection()` keeps `next build` from prerendering it, so the build
 * never depends on the API being reachable. Results are still served from the catalog cache.
 */
async function FeaturedGrid() {
  await connection();
  const { items } = await listProducts({ limit: FEATURED_COUNT, sort: 'newest' });
  return <ProductGrid products={items} />;
}
