import type { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ProductPageSchema, ProductSchema } from '@macrodetails/contracts';
import { createTestApp } from './support/create-test-app.js';

describe('Catalog (e2e)', () => {
  let app: INestApplication<App>;
  let connection: Connection;

  beforeAll(async () => {
    app = await createTestApp();
    connection = app.get<Connection>(getConnectionToken());
    await connection.dropDatabase();
    await connection.syncIndexes();

    const { insertedId: floristId } = await connection.collection('vendors').insertOne({
      slug: 'floreria-test',
      name: 'Florería Test',
      description: '',
      city: 'Campeche',
      logoUrl: null,
      leadTimeHours: 4,
      dailyCapacity: 10,
      active: true,
    });
    const { insertedId: bakeryId } = await connection.collection('vendors').insertOne({
      slug: 'pasteleria-test',
      name: 'Pastelería Test',
      description: '',
      city: 'Campeche',
      logoUrl: null,
      leadTimeHours: 24,
      dailyCapacity: 5,
      active: true,
    });

    const base = {
      description: '',
      tags: [],
      images: [],
      options: [],
      allergens: [],
      active: true,
      createdAt: new Date(),
    };
    await connection.collection('products').insertMany([
      {
        ...base,
        slug: 'ramo-rosas',
        vendorId: floristId,
        name: 'Ramo de rosas rojas',
        tags: ['rosas', 'romántico'],
        category: 'flowers',
        occasions: ['anniversary'],
        price: { amount: 65000, currency: 'MXN' },
        leadTimeHours: 4,
        options: [
          { type: 'text', key: 'card-message', label: 'Mensaje', required: false, maxLength: 200 },
        ],
      },
      {
        ...base,
        slug: 'girasoles',
        vendorId: floristId,
        name: 'Ramo de girasoles',
        category: 'flowers',
        occasions: ['birthday'],
        price: { amount: 52000, currency: 'MXN' },
        leadTimeHours: 4,
      },
      {
        ...base,
        slug: 'pastel-chocolate',
        vendorId: bakeryId,
        name: 'Pastel de chocolate',
        category: 'desserts',
        occasions: ['birthday'],
        price: { amount: 62000, currency: 'MXN' },
        leadTimeHours: 24,
      },
      {
        ...base,
        slug: 'producto-inactivo',
        vendorId: floristId,
        name: 'Producto oculto',
        category: 'flowers',
        occasions: [],
        price: { amount: 100, currency: 'MXN' },
        leadTimeHours: 4,
        active: false,
      },
    ]);
  });

  afterAll(async () => {
    await connection?.dropDatabase();
    await app?.close();
  });

  const http = () => request(app.getHttpServer());

  it('lists only active products and matches the shared page contract', async () => {
    const { body } = await http().get('/api/v1/products').expect(200);

    const page = ProductPageSchema.parse(body);
    expect(page.total).toBe(3);
    expect(page.items.map((item) => item.slug)).not.toContain('producto-inactivo');
  });

  it('filters by category, occasion and price range', async () => {
    const { body } = await http()
      .get('/api/v1/products')
      .query({ category: 'flowers', occasion: 'birthday', maxPrice: 60000 })
      .expect(200);

    expect(body.items.map((item: { slug: string }) => item.slug)).toEqual(['girasoles']);
  });

  it('filters by vendor slug', async () => {
    const { body } = await http()
      .get('/api/v1/products')
      .query({ vendor: 'pasteleria-test' })
      .expect(200);

    expect(body.items.map((item: { slug: string }) => item.slug)).toEqual(['pastel-chocolate']);
  });

  it('searches by text in Spanish (stemming: "rosa" finds "rosas")', async () => {
    const { body } = await http().get('/api/v1/products').query({ q: 'rosa' }).expect(200);

    expect(body.items[0]?.slug).toBe('ramo-rosas');
  });

  it('sorts by price and paginates', async () => {
    const { body } = await http()
      .get('/api/v1/products')
      .query({ sort: 'price-asc', limit: 2, page: 1 })
      .expect(200);

    expect(body.items.map((item: { slug: string }) => item.slug)).toEqual([
      'girasoles',
      'pastel-chocolate',
    ]);
    expect(body).toMatchObject({ total: 3, totalPages: 2 });
  });

  it('returns 400 with a readable message for invalid filters', async () => {
    const { body } = await http().get('/api/v1/products').query({ category: 'cars' }).expect(400);

    expect(JSON.stringify(body)).toContain('category');
  });

  it('returns the product detail with its vendor and options', async () => {
    const { body } = await http().get('/api/v1/products/ramo-rosas').expect(200);

    const product = ProductSchema.parse(body);
    expect(product.vendor.slug).toBe('floreria-test');
    expect(product.options[0]?.key).toBe('card-message');
  });

  it('returns 404 for unknown or inactive products', async () => {
    await http().get('/api/v1/products/no-existe').expect(404);
    await http().get('/api/v1/products/producto-inactivo').expect(404);
  });

  it('lists vendors', async () => {
    const { body } = await http().get('/api/v1/vendors').expect(200);

    expect(body.items).toHaveLength(2);
  });
});
