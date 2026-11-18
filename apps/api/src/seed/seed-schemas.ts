import { z } from 'zod';
import { ProductSchema, VendorSchema } from '@macrodetails/contracts';

/** Seed rows reuse the public contracts, so bad demo data fails before touching the DB. */
export const SeedVendorSchema = VendorSchema.omit({ id: true });

export const SeedProductSchema = ProductSchema.omit({
  id: true,
  vendor: true,
  images: true,
}).extend({
  vendorSlug: z.string(),
  /** Alt text for the product photos found in seed-assets/products/<slug>/. */
  imageAlt: z.string(),
});

export type SeedVendor = z.input<typeof SeedVendorSchema>;
export type SeedProduct = z.input<typeof SeedProductSchema>;
