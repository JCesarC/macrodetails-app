import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMessages } from '@/i18n';

export function EmptyResults() {
  const t = getMessages().catalog.listing;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
      <SearchX className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-medium">{t.empty.title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{t.empty.description}</p>
      <Button variant="outline" asChild>
        <Link href="/products">{t.clearAll}</Link>
      </Button>
    </div>
  );
}
