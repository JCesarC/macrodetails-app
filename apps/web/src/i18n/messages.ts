import { defaultLocale, type Locale } from './config';
import esMxCommon from './messages/es-MX/common.json';
import esMxHome from './messages/es-MX/home.json';

/**
 * UI copy lives in JSON files under ./messages/<locale>/<namespace>.json.
 * The es-MX bundle is the source of truth for the shape: when adding a locale,
 * declare it as `{ ... } satisfies Messages` so missing keys fail type-checking.
 */
const esMx = {
  common: esMxCommon,
  home: esMxHome,
};

export type Messages = typeof esMx;

const bundles: Record<Locale, Messages> = {
  'es-MX': esMx,
};

export function getMessages(locale: Locale = defaultLocale): Messages {
  return bundles[locale];
}
