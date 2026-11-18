import { Injectable } from '@nestjs/common';
import type { Vendor, VendorSummary } from '@macrodetails/contracts';
import { VendorRepository } from '../domain/vendor.repository.js';

/**
 * Public API of the vendors module. Other modules (catalog, orders…) talk to
 * vendors only through this class, never through the repository or the schema.
 */
@Injectable()
export class VendorDirectory {
  constructor(private readonly vendors: VendorRepository) {}

  listActive(): Promise<Vendor[]> {
    return this.vendors.findActive();
  }

  findBySlug(slug: string): Promise<Vendor | null> {
    return this.vendors.findBySlug(slug);
  }

  /** Returns a map so callers can enrich many records with a single query. */
  async summariesByIds(ids: readonly string[]): Promise<Map<string, VendorSummary>> {
    const unique = [...new Set(ids)];
    if (unique.length === 0) return new Map();

    const vendors = await this.vendors.findByIds(unique);
    return new Map(vendors.map((vendor) => [vendor.id, toSummary(vendor)]));
  }
}

export function toSummary({ id, slug, name, city, logoUrl }: Vendor): VendorSummary {
  return { id, slug, name, city, logoUrl };
}
