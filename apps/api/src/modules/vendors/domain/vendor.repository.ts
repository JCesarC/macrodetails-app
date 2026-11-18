import type { Vendor } from '@macrodetails/contracts';

/**
 * Port: how the vendors module reads vendors, independent of the database.
 * Declared as an abstract class so it doubles as the Nest injection token.
 */
export abstract class VendorRepository {
  abstract findActive(): Promise<Vendor[]>;
  abstract findBySlug(slug: string): Promise<Vendor | null>;
  abstract findByIds(ids: readonly string[]): Promise<Vendor[]>;
}
