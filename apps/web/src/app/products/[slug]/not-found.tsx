import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMessages } from '@/i18n';

export default function ProductNotFound() {
  const { notFound: t } = getMessages().productDetail;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <SearchX className="size-10 text-muted-foreground" aria-hidden />
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="text-pretty text-muted-foreground">{t.description}</p>
      <Button asChild>
        <Link href="/products">{t.backToCatalog}</Link>
      </Button>
    </main>
  );
}
