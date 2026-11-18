import type { Product, ProductSummary, VendorSummary } from '@macrodetails/contracts';
import type { ProductRecord } from '../domain/product-record.js';

export function toProductSummary(record: ProductRecord, vendor: VendorSummary): ProductSummary {
  const { id, slug, name, category, occasions, price, images, leadTimeHours } = record;
  return { id, slug, vendor, name, category, occasions, price, images, leadTimeHours };
}

export function toProduct(record: ProductRecord, vendor: VendorSummary): Product {
  const { vendorId: _vendorId, createdAt: _createdAt, ...rest } = record;
  return { ...rest, vendor };
}
