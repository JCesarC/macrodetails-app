import esMxErrors from './messages/es-MX/errors.json';

/**
 * The few namespaces that Client Components without server props need
 * (e.g. error boundaries). Kept separate so the full dictionary never ships
 * to the browser.
 */
export function getClientMessages() {
  return { errors: esMxErrors };
}
