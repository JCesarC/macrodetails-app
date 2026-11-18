import { describe, expect, it } from 'vitest';
import type { Vendor } from '@macrodetails/contracts';
import { VendorDirectory } from '../../vendors/index.js';
import { VendorRepository } from '../../vendors/domain/vendor.repository.js';
import type { ProductRecord, ProductSearchCriteria } from '../domain/product-record.js';
import { ProductRepository } from '../domain/product.repository.js';
import { ListProductsUseCase } from './list-products.use-case.js';

// In-memory adapters: the use case only knows the ports, so no database is needed.
class InMemoryVendors extends VendorRepository {
  constructor(private readonly vendors: Vendor[]) {
    super();
  }
  findActive = async () => this.vendors.filter((v) => v.active);
  findBySlug = async (slug: string) => this.vendors.find((v) => v.slug === slug) ?? null;
  findByIds = async (ids: readonly string[]) => this.vendors.filter((v) => ids.includes(v.id));
}

class InMemoryProducts extends ProductRepository {
  lastCriteria?: ProductSearchCriteria;
  constructor(private readonly products: ProductRecord[]) {
    super();
  }
  search = async (criteria: ProductSearchCriteria) => {
    this.lastCriteria = criteria;
    const items = this.products.filter(
      (p) => !criteria.vendorId || p.vendorId === criteria.vendorId,
    );
    return { items, total: items.length };
  };
  findBySlug = async (slug: string) => this.products.find((p) => p.slug === slug) ?? null;
}

const vendor: Vendor = {
  id: 'a'.repeat(24),
  slug: 'floreria',
  name: 'Florería',
  description: '',
  city: 'Campeche',
  logoUrl: null,
  leadTimeHours: 4,
  dailyCapacity: 10,
  active: true,
};

function product(overrides: Partial<ProductRecord>): ProductRecord {
  return {
    id: 'p'.padEnd(24, '0'),
    slug: 'ramo',
    vendorId: vendor.id,
    name: 'Ramo',
    description: '',
    category: 'flowers',
    occasions: ['birthday'],
    tags: [],
    price: { amount: 50000, currency: 'MXN' },
    images: [],
    options: [],
    allergens: [],
    leadTimeHours: 4,
    createdAt: new Date(),
    ...overrides,
  };
}

function setup(products: ProductRecord[]) {
  const productRepo = new InMemoryProducts(products);
  const useCase = new ListProductsUseCase(
    productRepo,
    new VendorDirectory(new InMemoryVendors([vendor])),
  );
  return { useCase, productRepo };
}

const baseQuery = { page: 1, limit: 12, sort: 'relevance' as const };

describe('ListProductsUseCase', () => {
  it('embeds the vendor summary in each product', async () => {
    const { useCase } = setup([product({})]);

    const page = await useCase.execute(baseQuery);

    expect(page.items[0]?.vendor).toEqual({
      id: vendor.id,
      slug: 'floreria',
      name: 'Florería',
      city: 'Campeche',
      logoUrl: null,
    });
    expect(page).toMatchObject({ total: 1, totalPages: 1, page: 1, limit: 12 });
  });

  it('translates the vendor slug into an id for the repository', async () => {
    const { useCase, productRepo } = setup([product({})]);

    await useCase.execute({ ...baseQuery, vendor: 'floreria', q: 'rosas' });

    expect(productRepo.lastCriteria).toMatchObject({ vendorId: vendor.id, text: 'rosas' });
  });

  it('returns an empty page for an unknown vendor without querying products', async () => {
    const { useCase, productRepo } = setup([product({})]);

    const page = await useCase.execute({ ...baseQuery, vendor: 'does-not-exist' });

    expect(page).toEqual({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
    expect(productRepo.lastCriteria).toBeUndefined();
  });

  it('hides products whose vendor no longer exists', async () => {
    const { useCase } = setup([
      product({}),
      product({ slug: 'huerfano', vendorId: 'b'.repeat(24) }),
    ]);

    const page = await useCase.execute(baseQuery);

    expect(page.items.map((item) => item.slug)).toEqual(['ramo']);
  });
});
