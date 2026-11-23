'use client';

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMessage } from '@/i18n/format';
import { getClientMessages } from '@/i18n/client-messages';

// Error boundary for every route. The most common cause today is the API being
// unreachable for a moment (e.g. while it restarts in dev); `retry` re-fetches.
export default function RouteError({ error, retry }: { error: unknown; retry: () => void }) {
  const { errors: t } = getClientMessages();
  const digest = error instanceof Error && 'digest' in error ? String(error.digest) : null;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="text-pretty text-muted-foreground">{t.description}</p>
      <div className="flex gap-2">
        <Button onClick={() => retry()}>
          <RefreshCw aria-hidden />
          {t.retry}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">{t.goHome}</Link>
        </Button>
      </div>
      {digest && (
        <p className="text-xs text-muted-foreground">{formatMessage(t.reference, { digest })}</p>
      )}
    </main>
  );
}
