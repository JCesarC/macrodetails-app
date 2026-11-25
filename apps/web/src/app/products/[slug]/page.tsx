import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@macrodetails/contracts';
import { ProductGallery } from '@/components/catalog/product-gallery';
import { ProductOverview } from '@/components/catalog/product-overview';
import { Skeleton } from '@/components/ui/skeleton';
import { getMessages } from '@/i18n';
import { getProduct } from '@/lib/api/catalog';
import { catalogHref, parseCatalogSearchParams } from '@/lib/catalog/search-params';

export default function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ProductDetail({ params }: Pick<PageProps<'/products/[slug]'>, 'params'>) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <ProductBreadcrumb product={product} />
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} category={product.category} />
        <ProductOverview product={product} />
      </div>
    </>
  );
}

function ProductBreadcrumb({ product }: { product: Product }) {
  const { productDetail: t, catalog } = getMessages();
  const categoryHref = catalogHref(parseCatalogSearchParams({}), { category: product.category });

  return (
    <nav aria-label={t.breadcrumb}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/products" className="hover:text-foreground">
            {t.explore}
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-4" />
        </li>
        <li>
          <Link href={categoryHref} className="hover:text-foreground">
            {catalog.categories[product.category]}
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="truncate text-foreground">
          {product.name}
        </li>
      </ol>
    </nav>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <Skeleton className="h-5 w-64" />
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
