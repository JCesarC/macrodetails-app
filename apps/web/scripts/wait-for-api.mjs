// Dev helper: `pnpm dev` starts web and API together, but Next is ready in
// ~1s while Nest needs a few seconds to compile. Waiting for the API health
// check avoids a burst of "fetch failed" errors on startup. If the API never
// comes up (e.g. running the web alone), it warns and lets Next start anyway.
import { existsSync } from 'node:fs';

if (!process.env.API_URL && existsSync('.env.local')) process.loadEnvFile('.env.local');

const apiUrl = process.env.API_URL ?? 'http://localhost:4000';
const healthUrl = new URL('/api/v1/health', apiUrl);
const timeoutMs = Number(process.env.WAIT_FOR_API_TIMEOUT_MS ?? 30_000);
const intervalMs = 500;

async function isUp() {
  try {
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(1_000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

const startedAt = Date.now();
let announced = false;

while (!(await isUp())) {
  if (Date.now() - startedAt >= timeoutMs) {
    console.warn(
      `⚠ API not reachable at ${healthUrl} after ${timeoutMs / 1000}s; starting Next anyway.`,
    );
    process.exit(0);
  }
  if (!announced) {
    console.log(`… waiting for the API at ${healthUrl}`);
    announced = true;
  }
  await new Promise((resolve) => setTimeout(resolve, intervalMs));
}

if (announced) console.log(`✓ API ready after ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
