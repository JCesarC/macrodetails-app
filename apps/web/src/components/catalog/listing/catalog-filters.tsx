import { CATEGORIES, OCCASIONS, type Vendor } from '@macrodetails/contracts';
import { getMessages } from '@/i18n';
import { findPriceRange, PRICE_RANGES } from '@/lib/catalog/price-ranges';
import { catalogHref, type CatalogFilters as Filters } from '@/lib/catalog/search-params';
import { FilterLink } from './filter-link';

interface CatalogFiltersProps {
  filters: Filters;
  vendors: Vendor[];
}

export function CatalogFilters({ filters, vendors }: CatalogFiltersProps) {
  const { listing: t, categories, occasions } = getMessages().catalog;
  const activePrice = findPriceRange(filters.minPrice, filters.maxPrice)?.key;

  return (
    <div className="flex flex-col gap-6">
      <FilterSection title={t.category}>
        <FilterLink href={catalogHref(filters, { category: undefined })} active={!filters.category}>
          {t.all}
        </FilterLink>
        {CATEGORIES.map((category) => (
          <FilterLink
            key={category}
            href={catalogHref(filters, { category })}
            active={filters.category === category}
          >
            {categories[category]}
          </FilterLink>
        ))}
      </FilterSection>

      <FilterSection title={t.occasion}>
        <FilterLink href={catalogHref(filters, { occasion: undefined })} active={!filters.occasion}>
          {t.all}
        </FilterLink>
        {OCCASIONS.map((occasion) => (
          <FilterLink
            key={occasion}
            href={catalogHref(filters, { occasion })}
            active={filters.occasion === occasion}
          >
            {occasions[occasion]}
          </FilterLink>
        ))}
      </FilterSection>

      <FilterSection title={t.price}>
        <FilterLink
          href={catalogHref(filters, { minPrice: undefined, maxPrice: undefined })}
          active={filters.minPrice === undefined && filters.maxPrice === undefined}
        >
          {t.all}
        </FilterLink>
        {PRICE_RANGES.map((range) => (
          <FilterLink
            key={range.key}
            href={catalogHref(filters, { minPrice: range.minPrice, maxPrice: range.maxPrice })}
            active={activePrice === range.key}
          >
            {t.priceRanges[range.key]}
          </FilterLink>
        ))}
      </FilterSection>

      {vendors.length > 0 && (
        <FilterSection title={t.vendor}>
          <FilterLink href={catalogHref(filters, { vendor: undefined })} active={!filters.vendor}>
            {t.allVendors}
          </FilterLink>
          {vendors.map((vendor) => (
            <FilterLink
              key={vendor.slug}
              href={catalogHref(filters, { vendor: vendor.slug })}
              active={filters.vendor === vendor.slug}
            >
              {vendor.name}
            </FilterLink>
          ))}
        </FilterSection>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="px-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
