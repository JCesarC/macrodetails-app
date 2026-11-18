import { Injectable } from '@nestjs/common';
import type { Page, ProductListQuery, ProductSummary } from '@macrodetails/contracts';
import { VendorDirectory } from '../../vendors/index.js';
import { ProductRepository } from '../domain/product.repository.js';
import { toProductSummary } from './product-mapper.js';

@Injectable()
export class ListProductsUseCase {
  constructor(
    private readonly products: ProductRepository,
    private readonly vendors: VendorDirectory,
  ) {}

  async execute(query: ProductListQuery): Promise<Page<ProductSummary>> {
    const { page, limit } = query;

    let vendorId: string | undefined;
    if (query.vendor) {
      const vendor = await this.vendors.findBySlug(query.vendor);
      if (!vendor) return emptyPage(page, limit);
      vendorId = vendor.id;
    }

    const { items, total } = await this.products.search({
      text: query.q,
      category: query.category,
      occasion: query.occasion,
      vendorId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: query.sort,
      page,
      limit,
    });

    const vendorsById = await this.vendors.summariesByIds(items.map((item) => item.vendorId));
    // A product whose vendor is missing is not sellable, so it is hidden.
    const summaries = items.flatMap((item) => {
      const vendor = vendorsById.get(item.vendorId);
      return vendor ? [toProductSummary(item, vendor)] : [];
    });

    return { items: summaries, page, limit, total, totalPages: Math.ceil(total / limit) };
  }
}

function emptyPage(page: number, limit: number): Page<ProductSummary> {
  return { items: [], page, limit, total: 0, totalPages: 0 };
}
