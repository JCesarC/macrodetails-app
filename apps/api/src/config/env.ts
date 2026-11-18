import { z } from 'zod';

/**
 * API environment variables, validated at startup: if anything is missing
 * the app refuses to boot and the error names the exact variable to fix.
 */
/** Treats `KEY=` (empty) in .env files the same as an unset variable. */
const emptyAsUndefined = (value: unknown) => (value === '' ? undefined : value);

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  WEB_ORIGIN: z.url().default('http://localhost:3000'),
  AWS_REGION: z.string().default('us-east-2'),
  /** Media bucket and the CDN in front of it. Optional: without them storage is disabled. */
  MEDIA_BUCKET: z.preprocess(emptyAsUndefined, z.string().min(1).optional()),
  MEDIA_BASE_URL: z.preprocess(emptyAsUndefined, z.url().optional()),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = EnvSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
