import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getMessages } from '@/i18n';
import { cn } from '@/lib/utils';

/** Plain GET form: works without JavaScript and lands on /products?q=… */
export function SearchForm({ className }: { className?: string }) {
  const { search: t } = getMessages().layout;

  return (
    <form action="/products" role="search" className={cn('relative', className)}>
      <label htmlFor="site-search" className="sr-only">
        {t.label}
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input id="site-search" name="q" type="search" placeholder={t.placeholder} className="pl-9" />
    </form>
  );
}
