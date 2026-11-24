import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ActiveFilters } from '@/components/catalog/listing/active-filters';
import { CatalogFilters } from '@/components/catalog/listing/catalog-filters';
import { CatalogPagination } from '@/components/catalog/listing/catalog-pagination';
import { EmptyResults } from '@/components/catalog/listing/empty-results';
import { MobileFilters } from '@/components/catalog/listing/mobile-filters';
import { SortSelect } from '@/components/catalog/listing/sort-select';
import { ProductGrid, ProductGridSkeleton } from '@/components/catalog/product-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMessage, getMessages } from '@/i18n';
import { listProducts, listVendors } from '@/lib/api/catalog';
import {
  CATALOG_PAGE_SIZE,
  catalogHref,
  parseCatalogSearchParams,
} from '@/lib/catalog/search-params';
import { PRODUCT_SORTS } from '@/lib/catalog/sorts';

export const metadata: Metadata = { title: getMessages().catalog.listing.title };

export default function ProductsPage({ searchParams }: PageProps<'/products'>) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Catalog({ searchParams }: Pick<PageProps<'/products'>, 'searchParams'>) {
  const { catalog } = getMessages();
  const t = catalog.listing;
  const filters = parseCatalogSearchParams(await searchParams);

  const [page, vendors] = await Promise.all([
    listProducts({
      q: filters.q,
      category: filters.category,
      occasion: filters.occasion,
      vendor: filters.vendor,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      page: filters.page,
      limit: CATALOG_PAGE_SIZE,
    }),
    listVendors(),
  ]);

  const activeCount = [
    filters.q,
    filters.category,
    filters.occasion,
    filters.vendor,
    filters.minPrice ?? filters.maxPrice,
  ].filter((value) => value !== undefined).length;
  const countLabel =
    page.total === 1 ? t.countOne : formatMessage(t.countOther, { count: page.total });
  const sortOptions = PRODUCT_SORTS.map((sort) => ({
    value: sort,
    label: catalog.sort[sort],
    href: catalogHref(filters, { sort }),
  }));
  const filtersPanel = <CatalogFilters filters={filters} vendors={vendors} />;

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold text-balance">
          {filters.q ? formatMessage(t.resultsFor, { query: filters.q }) : t.title}
        </h1>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {countLabel}
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <MobileFilters labels={{ open: t.openFilters, title: t.filters }} activeCount={activeCount}>
          {filtersPanel}
        </MobileFilters>
        <div className="ml-auto">
          <SortSelect label={catalog.sort.label} value={filters.sort} options={sortOptions} />
        </div>
      </div>

      <ActiveFilters filters={filters} vendors={vendors} />

      <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block" aria-label={t.filters}>
          {filtersPanel}
        </aside>
        <div className="flex flex-col gap-8">
          {page.items.length > 0 ? <ProductGrid products={page.items} /> : <EmptyResults />}
          <CatalogPagination filters={filters} totalPages={page.totalPages} />
        </div>
      </div>
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-9 w-full max-w-sm self-end" />
      <ProductGridSkeleton count={CATALOG_PAGE_SIZE} />
    </div>
  );
}
