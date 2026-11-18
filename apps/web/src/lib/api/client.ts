import type { z } from 'zod';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type QueryValue = string | number | boolean | undefined | null;

/**
 * Server-side fetch to the MacroDetails API.
 * Every response is validated against the shared Zod contract, so a breaking
 * API change fails loudly here instead of rendering broken UI.
 */
export async function apiGet<T extends z.ZodType>(
  path: string,
  schema: T,
  query: Record<string, QueryValue> = {},
): Promise<z.infer<T>> {
  const url = new URL(`/api/v1${path}`, API_URL);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '')
      url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) {
    throw new ApiError(res.status, path, `GET ${url.pathname} failed with ${res.status}`);
  }
  return schema.parse(await res.json());
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
