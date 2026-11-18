import { describe, expect, it } from 'vitest';
import { HealthResponseSchema } from './health.js';

describe('HealthResponseSchema', () => {
  it('accepts a valid response', () => {
    const result = HealthResponseSchema.safeParse({
      status: 'ok',
      service: 'api',
      version: '0.0.1',
      uptimeSeconds: 12.5,
      checks: { mongo: 'up' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects an unknown dependency status', () => {
    const result = HealthResponseSchema.safeParse({
      status: 'ok',
      service: 'api',
      version: '0.0.1',
      uptimeSeconds: 1,
      checks: { mongo: 'maybe' },
    });
    expect(result.success).toBe(false);
  });
});
