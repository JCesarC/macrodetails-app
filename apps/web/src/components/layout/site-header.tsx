import Link from 'next/link';
import { Gift } from 'lucide-react';
import { getMessages } from '@/i18n';
import { MobileNav } from './mobile-nav';
import { SearchForm } from './search-form';
import { NAV_ITEMS } from './site-nav';

export function SiteHeader() {
  const t = getMessages().layout;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <MobileNav labels={t.nav} />
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-heading text-lg font-semibold"
        >
          <Gift className="size-5 text-primary" aria-hidden />
          {t.brand}
        </Link>
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav[item.labelKey]}
            </Link>
          ))}
        </nav>
        <SearchForm className="ml-auto w-full max-w-xs" />
      </div>
    </header>
  );
}
