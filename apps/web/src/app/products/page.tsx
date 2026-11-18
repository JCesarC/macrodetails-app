import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductGrid, ProductGridSkeleton } from '@/components/catalog/product-grid';
import { getMessages } from '@/i18n';
import { listProducts } from '@/lib/api/catalog';

// Minimal listing to validate the data flow. Filters, sorting and pagination
// arrive with the full catalog page.
export const metadata: Metadata = { title: getMessages().layout.nav.explore };

export default function ProductsPage({ searchParams }: PageProps<'/products'>) {
  const { nav } = getMessages().layout;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold">{nav.explore}</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ProductResults({ searchParams }: Pick<PageProps<'/products'>, 'searchParams'>) {
  const { q } = await searchParams;
  const page = await listProducts({ q: typeof q === 'string' ? q : undefined, limit: 24 });
  return <ProductGrid products={page.items} />;
}
