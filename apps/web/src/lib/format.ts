import type { Money } from '@macrodetails/contracts';
import { defaultLocale, formatMessage, type Locale } from '@/i18n';

/** Formats an amount stored in centavos, e.g. { amount: 65000 } -> "$650". */
export function formatPrice(money: Money, locale: Locale = defaultLocale): string {
  const hasCents = money.amount % 100 !== 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(money.amount / 100);
}

/**
 * Formats a preparation time for display.
 * Under two days it is shown in hours; from 48 hours on it is rounded to whole days.
 * @param hours Preparation time in hours.
 * @param templates Messages with a `{hours}` and a `{days}` placeholder.
 * @returns The filled template, e.g. "Listo en 6 h" or "Listo en 3 días".
 */
export function formatLeadTime(
  hours: number,
  templates: { readyIn: string; readyInDays: string },
): string {
  return hours >= 48
    ? formatMessage(templates.readyInDays, { days: Math.round(hours / 24) })
    : formatMessage(templates.readyIn, { hours });
}
