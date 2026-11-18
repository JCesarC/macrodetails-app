import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { HealthResponseSchema } from '@macrodetails/contracts';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/configure-app.js';

// Requires Mongo running (pnpm infra:up) and MONGODB_URI in the environment or in .env.
describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
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
