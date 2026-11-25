import Link from 'next/link';
import { Clock, ShieldAlert } from 'lucide-react';
import type { Product } from '@macrodetails/contracts';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatMessage, getMessages } from '@/i18n';
import { catalogHref, parseCatalogSearchParams } from '@/lib/catalog/search-params';
import { formatLeadTime, formatPrice } from '@/lib/format';

export function ProductOverview({ product }: { product: Product }) {
  const { productDetail: t, catalog } = getMessages();
  const allFilters = parseCatalogSearchParams({});
  const hasPricedChoices = product.options.some(
    (option) => option.type === 'select' && option.choices.some((choice) => choice.priceDelta > 0),
  );
  const price = formatPrice(product.price);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Link
          href={catalogHref(allFilters, { vendor: product.vendor.slug })}
          className="w-fit text-sm text-muted-foreground hover:text-foreground"
        >
          {formatMessage(t.vendor, { vendor: product.vendor.name, city: product.vendor.city })}
        </Link>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {product.name}
        </h1>
        <p className="text-2xl font-semibold tabular-nums">
          {hasPricedChoices ? formatMessage(catalog.product.fromPrice, { price }) : price}
        </p>
      </div>

      {product.occasions.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">{t.idealFor}</h2>
          <ul className="flex flex-wrap gap-2">
            {product.occasions.map((occasion) => (
              <li key={occasion}>
                <Badge variant="secondary" asChild>
                  <Link href={catalogHref(allFilters, { occasion })}>
                    {catalog.occasions[occasion]}
                  </Link>
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="leading-relaxed text-pretty text-muted-foreground">{product.description}</p>

      <Separator />

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="flex gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <dt className="font-medium">{t.leadTime}</dt>
            <dd className="text-muted-foreground">
              {formatLeadTime(product.leadTimeHours, catalog.product)}
            </dd>
          </div>
        </div>
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <dt className="font-medium">{t.allergens}</dt>
            <dd className="text-muted-foreground">
              {product.allergens.length > 0
                ? product.allergens.map((allergen) => catalog.allergens[allergen]).join(', ')
                : t.noAllergens}
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
