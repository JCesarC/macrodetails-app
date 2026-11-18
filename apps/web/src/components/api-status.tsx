import { formatMessage, getMessages } from '@/i18n';
import { getApiHealth } from '@/lib/api';

const DOT_COLORS = {
  ok: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  offline: 'bg-rose-500',
} as const;

export async function ApiStatus() {
  const { apiStatus: t } = getMessages().common;
  const health = await getApiHealth();
  const state = health?.status ?? 'offline';

  return (
    <p className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
      <span className={`size-2 rounded-full ${DOT_COLORS[state]}`} aria-hidden />
      {t[state]}
      {health && (
        <span className="text-stone-400">
          · {formatMessage(t.version, { version: health.version })}
        </span>
      )}
    </p>
  );
}

export function ApiStatusSkeleton() {
  const { apiStatus: t } = getMessages().common;

  return (
    <p className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 px-3 py-1 text-sm text-stone-400 dark:border-stone-800">
      <span className="size-2 animate-pulse rounded-full bg-stone-300" aria-hidden />
      {t.checking}
    </p>
  );
}
