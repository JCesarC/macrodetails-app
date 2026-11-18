import { Injectable } from '@nestjs/common';
import type { Product } from '@macrodetails/contracts';
import { VendorDirectory } from '../../vendors/index.js';
import { ProductRepository } from '../domain/product.repository.js';
import { toProduct } from './product-mapper.js';

@Injectable()
export class GetProductUseCase {
  constructor(
    private readonly products: ProductRepository,
    private readonly vendors: VendorDirectory,
  ) {}

  /** Returns null when the product does not exist or its vendor is gone. */
  async execute(slug: string): Promise<Product | null> {
    const record = await this.products.findBySlug(slug);
    if (!record) return null;

    const vendor = (await this.vendors.summariesByIds([record.vendorId])).get(record.vendorId);
    return vendor ? toProduct(record, vendor) : null;
  }
}
