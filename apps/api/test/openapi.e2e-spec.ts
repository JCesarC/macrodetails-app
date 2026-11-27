import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { createTestApp } from './support/create-test-app.js';

interface OpenApiDocument {
  paths: Record<string, Record<string, OpenApiOperation>>;
  components: { schemas: Record<string, unknown> };
}

interface OpenApiOperation {
  parameters?: { name: string; in: string }[];
  responses: Record<string, { content?: { 'application/json': { schema: { $ref?: string } } } }>;
}

describe('OpenAPI document (e2e)', () => {
  let app: INestApplication<App>;
  let document: OpenApiDocument;

  beforeAll(async () => {
    app = await createTestApp();
    const response = await request(app.getHttpServer()).get('/api/openapi.json').expect(200);
    document = response.body as OpenApiDocument;
  });

  afterAll(async () => {
    await app?.close();
  });

  const responseRef = (path: string, status: string) =>
    document.paths[path]?.get?.responses[status]?.content?.['application/json'].schema.$ref;

  it('lists every public endpoint under the versioned prefix', () => {
    expect(Object.keys(document.paths).sort()).toEqual([
      '/api/v1/health',
      '/api/v1/products',
      '/api/v1/products/{slug}',
      '/api/v1/vendors',
      '/api/v1/vendors/{slug}',
    ]);
  });

  it('exposes the contract schemas as named components', () => {
    expect(Object.keys(document.components.schemas)).toEqual(
      expect.arrayContaining(['Product', 'ProductPage', 'Vendor', 'VendorList', 'HealthResponse']),
    );
  });

  it('references the contracts in the responses', () => {
    expect(responseRef('/api/v1/products', '200')).toBe('#/components/schemas/ProductPage');
    expect(responseRef('/api/v1/products/{slug}', '200')).toBe('#/components/schemas/Product');
    expect(responseRef('/api/v1/vendors', '200')).toBe('#/components/schemas/VendorList');
    expect(document.paths['/api/v1/products/{slug}']?.get?.responses).toHaveProperty('404');
  });

  it('derives the product query parameters from the contract', () => {
    const names = document.paths['/api/v1/products']?.get?.parameters?.map(({ name }) => name);
    expect(names?.sort()).toEqual(
      [
        'category',
        'limit',
        'maxPrice',
        'minPrice',
        'occasion',
        'page',
        'q',
        'sort',
        'vendor',
      ].sort(),
    );
  });

  it('serves Swagger UI', async () => {
    await request(app.getHttpServer()).get('/api/docs').expect(200).expect('Content-Type', /html/);
  });
});
