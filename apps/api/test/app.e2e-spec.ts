import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { HealthResponseSchema } from '@macrodetails/contracts';
import { createTestApp } from './support/create-test-app.js';

// Requires Mongo running (pnpm infra:up). Uses the "<db>-test" database.
describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    // app is undefined when beforeAll failed (e.g. Mongo is down); don't mask that error.
    await app?.close();
  });

  it('GET /api/v1/health matches the shared contract', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

    const health = HealthResponseSchema.parse(response.body);
    expect(health.status).toBe('ok');
    expect(health.checks.mongo).toBe('up');
  });
});
