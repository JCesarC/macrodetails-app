import type { Money } from '@macrodetails/contracts';
import { defaultLocale, type Locale } from '@/i18n';

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
