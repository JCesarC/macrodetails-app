import { z } from 'zod';
import { IdSchema, SlugSchema } from '../common/primitives.js';

export const VendorSchema = z.object({
  id: IdSchema,
  slug: SlugSchema,
  name: z.string().min(1).max(120),
  description: z.string().max(1000),
  city: z.string().min(1),
  logoUrl: z.url().nullable(),
  /** Minimum hours the vendor needs between order and delivery. */
  leadTimeHours: z.number().int().min(0),
  /** Max orders the vendor can fulfil per day. */
  dailyCapacity: z.number().int().min(1),
  active: z.boolean(),
});

/** Public, embeddable view of a vendor (e.g. inside a product). */
export const VendorSummarySchema = VendorSchema.pick({
  id: true,
  slug: true,
  name: true,
  city: true,
  logoUrl: true,
});

export const VendorListSchema = z.object({
  items: z.array(VendorSchema),
});

export type Vendor = z.infer<typeof VendorSchema>;
export type VendorSummary = z.infer<typeof VendorSummarySchema>;
export type VendorList = z.infer<typeof VendorListSchema>;
