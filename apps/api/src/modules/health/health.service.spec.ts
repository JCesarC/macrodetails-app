import { describe, expect, it } from 'vitest';
import { HealthResponseSchema } from '@macrodetails/contracts';
import { HealthService } from './health.service.js';

describe('HealthService', () => {
  it('reports ok when Mongo is connected', () => {
    const health = new HealthService({ readyState: 1 }).check();

    expect(health.status).toBe('ok');
    expect(health.checks).toEqual({ mongo: 'up' });
    expect(HealthResponseSchema.parse(health)).toEqual(health);
  });

  it('reports degraded when Mongo is not connected', () => {
    const health = new HealthService({ readyState: 0 }).check();

    expect(health.status).toBe('degraded');
    expect(health.checks).toEqual({ mongo: 'down' });
  });
});
