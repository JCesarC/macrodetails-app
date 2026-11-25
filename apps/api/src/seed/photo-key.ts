import { createHash } from 'node:crypto';
import { basename, extname } from 'node:path';

const HASH_LENGTH = 12;

/**
 * Builds the bucket key for a seed photo.
 * Photos are served with a one-year immutable cache, so the key embeds a hash of the
 * contents: replacing a photo produces a new key instead of a stale cached copy, and
 * re-running the seed with unchanged photos keeps the same keys.
 * @param slug Product slug, used as the folder.
 * @param fileName Original file name; its name is kept so photos stay in order.
 * @param body File contents.
 * @returns A key like `products/<slug>/1-3f2a9c1b7d4e.webp`.
 */
export function seedPhotoKey(slug: string, fileName: string, body: Uint8Array): string {
  const extension = extname(fileName);
  const name = basename(fileName, extension);
  const hash = createHash('sha256').update(body).digest('hex').slice(0, HASH_LENGTH);
  return `products/${slug}/${name}-${hash}${extension.toLowerCase()}`;
}
