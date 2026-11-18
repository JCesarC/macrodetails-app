import { Suspense } from 'react';
import { ApiStatus, ApiStatusSkeleton } from '@/components/api-status';
import { getMessages } from '@/i18n';

export default function Home() {
  const { home: t } = getMessages();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-24 sm:px-6">
      <Suspense fallback={<ApiStatusSkeleton />}>
        <ApiStatus />
      </Suspense>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-widest text-rose-600">{t.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t.title}
        </h1>
        <p className="max-w-xl text-lg text-pretty text-stone-600 dark:text-stone-400">
          {t.subtitle}
        </p>
      </div>

      <p className="text-sm text-stone-500">{t.buildStatus}</p>
    </main>
  );
}
