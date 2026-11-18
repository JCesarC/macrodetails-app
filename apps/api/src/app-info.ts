import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Resolves the same way from src/ (dev, tests) and from dist/ (production).
const packageJson = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8'),
) as { version: string };

export const APP_INFO = {
  service: 'api',
  version: packageJson.version,
} as const;
