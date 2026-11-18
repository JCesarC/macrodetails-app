import { HealthResponseSchema, type HealthResponse } from '@macrodetails/contracts';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

/**
 * Fetches the API health status and validates it against the shared contract.
 * Returns null when the API is unreachable or the response breaks the contract.
 */
export async function getApiHealth(): Promise<HealthResponse | null> {
  try {
    // A degraded API answers 503 with the same body, so we don't filter on res.ok.
    const res = await fetch(`${API_URL}/api/v1/health`, { signal: AbortSignal.timeout(3000) });
    return HealthResponseSchema.parse(await res.json());
  } catch {
    return null;
  }
}
