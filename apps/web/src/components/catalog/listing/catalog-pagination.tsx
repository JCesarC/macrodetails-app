import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMessage, getMessages } from '@/i18n';
import { paginationItems } from '@/lib/catalog/pagination';
import { catalogHref, type CatalogFilters } from '@/lib/catalog/search-params';
import { cn } from '@/lib/utils';

interface CatalogPaginationProps {
  filters: CatalogFilters;
  totalPages: number;
}

const itemClass =
  'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-3 text-sm transition-colors hover:bg-accent';

export function CatalogPagination({ filters, totalPages }: CatalogPaginationProps) {
  const t = getMessages().catalog.listing.pagination;
  const items = paginationItems(filters.page, totalPages);
  if (items.length === 0) return null;

  const hasPrevious = filters.page > 1;
  const hasNext = filters.page < totalPages;

  return (
    <nav aria-label={t.label} className="flex flex-wrap items-center justify-center gap-1">
      {hasPrevious && (
        <Link href={catalogHref(filters, { page: filters.page - 1 })} className={itemClass}>
          <ChevronLeft className="size-4" aria-hidden />
          {t.previous}
        </Link>
      )}
      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={item}
            href={catalogHref(filters, { page: item })}
            aria-label={formatMessage(t.page, { page: item })}
            aria-current={item === filters.page ? 'page' : undefined}
            className={cn(
              itemClass,
              item === filters.page &&
                'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {item}
          </Link>
        ),
      )}
      {hasNext && (
        <Link href={catalogHref(filters, { page: filters.page + 1 })} className={itemClass}>
          {t.next}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
