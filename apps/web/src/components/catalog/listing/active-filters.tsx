import Link from 'next/link';
import { X } from 'lucide-react';
import type { Vendor } from '@macrodetails/contracts';
import { formatMessage, getMessages } from '@/i18n';
import { findPriceRange } from '@/lib/catalog/price-ranges';
import { catalogHref, type CatalogFilters } from '@/lib/catalog/search-params';

interface ActiveFiltersProps {
  filters: CatalogFilters;
  vendors: Vendor[];
}

export function ActiveFilters({ filters, vendors }: ActiveFiltersProps) {
  const { listing: t, categories, occasions } = getMessages().catalog;
  const priceRange = findPriceRange(filters.minPrice, filters.maxPrice);
  const vendorName =
    vendors.find((vendor) => vendor.slug === filters.vendor)?.name ?? filters.vendor;

  const chips = [
    filters.q && { label: `“${filters.q}”`, href: catalogHref(filters, { q: undefined }) },
    filters.category && {
      label: categories[filters.category],
      href: catalogHref(filters, { category: undefined }),
    },
    filters.occasion && {
      label: occasions[filters.occasion],
      href: catalogHref(filters, { occasion: undefined }),
    },
    priceRange && {
      label: t.priceRanges[priceRange.key],
      href: catalogHref(filters, { minPrice: undefined, maxPrice: undefined }),
    },
    filters.vendor && { label: vendorName, href: catalogHref(filters, { vendor: undefined }) },
  ].filter((chip): chip is { label: string; href: string } => Boolean(chip));

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.href}>
          <Link
            href={chip.href}
            scroll={false}
            aria-label={formatMessage(t.removeFilter, { label: chip.label })}
            className="inline-flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-sm transition-colors hover:border-primary/40"
          >
            {chip.label}
            <X className="size-3.5" aria-hidden />
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={catalogHref(filters, {
            q: undefined,
            category: undefined,
            occasion: undefined,
            vendor: undefined,
            minPrice: undefined,
            maxPrice: undefined,
          })}
          scroll={false}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t.clearAll}
        </Link>
      </li>
    </ul>
  );
}
