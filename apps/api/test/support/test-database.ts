import { existsSync } from 'node:fs';

/**
 * Points MONGODB_URI at a dedicated "<db>-test" database before the app boots,
 * so e2e tests can freely wipe data without touching the dev database.
 */
export function useTestDatabase(): string {
  if (!process.env.MONGODB_URI && existsSync('.env')) process.loadEnvFile('.env');

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required for e2e tests (see apps/api/.env.example)');

  const url = new URL(uri);
  const database = url.pathname.replace(/^\//, '') || 'macrodetails';
  if (!database.endsWith('-test')) url.pathname = `/${database}-test`;

  process.env.MONGODB_URI = url.toString();
  return process.env.MONGODB_URI;
}
