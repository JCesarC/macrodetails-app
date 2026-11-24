import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@macrodetails/contracts';
import { CategoryIcon } from '@/components/catalog/category-icon';
import { Button } from '@/components/ui/button';
import { getMessages } from '@/i18n';

export function Hero() {
  const { home, catalog } = getMessages();
  const t = home.hero;

  return (
    <section className="border-b bg-gradient-to-b from-accent/60 to-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr] md:items-center md:py-20">
        <div className="flex flex-col gap-5">
          <p className="text-sm font-medium tracking-wide text-primary">{t.eyebrow}</p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t.title}
          </h1>
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">{t.subtitle}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/products">
                {t.primaryCta}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#occasions">{t.secondaryCta}</Link>
            </Button>
          </div>
        </div>

        <nav aria-label={t.categoriesLabel}>
          <ul className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/products?category=${category}`}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border bg-card p-2 text-center text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <CategoryIcon category={category} className="size-7 text-primary" />
                  {catalog.categories[category]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
