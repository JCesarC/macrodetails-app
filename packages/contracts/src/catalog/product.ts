import { z } from 'zod';
import {
  IdSchema,
  MoneySchema,
  PaginationQuerySchema,
  SlugSchema,
  pageOf,
} from '../common/primitives.js';
import { AllergenSchema, CategorySchema, OccasionSchema } from './taxonomy.js';
import { VendorSummarySchema } from './vendor.js';

export const ProductImageSchema = z.object({
  url: z.url(),
  alt: z.string().max(200),
});

export const ProductOptionChoiceSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  /** Extra cost in centavos added when this choice is selected. */
  priceDelta: z.number().int().default(0),
});

/**
 * A customization the buyer can pick or fill in (size, color, card text…).
 * `label` is product content written by the vendor, so it is stored as data.
 */
export const ProductOptionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('select'),
    key: z.string().min(1),
    label: z.string().min(1),
    required: z.boolean(),
    choices: z.array(ProductOptionChoiceSchema).min(1),
  }),
  z.object({
    type: z.literal('text'),
    key: z.string().min(1),
    label: z.string().min(1),
    required: z.boolean(),
    maxLength: z.number().int().min(1).max(500),
  }),
]);

export const ProductSchema = z
  .object({
    id: IdSchema,
    slug: SlugSchema,
    vendor: VendorSummarySchema,
    name: z.string().min(1).max(160),
    description: z.string().max(2000),
    category: CategorySchema,
    occasions: z.array(OccasionSchema),
    tags: z.array(z.string()),
    price: MoneySchema,
    images: z.array(ProductImageSchema),
    options: z.array(ProductOptionSchema),
    allergens: z.array(AllergenSchema),
    leadTimeHours: z.number().int().min(0),
  })
  .meta({ id: 'Product' });

/** Lighter shape for listings and recommendation cards. */
export const ProductSummarySchema = ProductSchema.pick({
  id: true,
  slug: true,
  vendor: true,
  name: true,
  category: true,
  occasions: true,
  price: true,
  images: true,
  leadTimeHours: true,
}).meta({ id: 'ProductSummary' });

export const ProductSortSchema = z.enum(['relevance', 'price-asc', 'price-desc', 'newest']);

export const ProductListQuerySchema = PaginationQuerySchema.extend({
  q: z.string().trim().min(1).max(100).optional(),
  category: CategorySchema.optional(),
  occasion: OccasionSchema.optional(),
  vendor: SlugSchema.optional(),
  /** Price bounds in centavos. */
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sort: ProductSortSchema.default('relevance'),
}).refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
  message: 'minPrice must be less than or equal to maxPrice',
  path: ['minPrice'],
});

export const ProductPageSchema = pageOf(ProductSummarySchema).meta({ id: 'ProductPage' });

export type ProductImage = z.infer<typeof ProductImageSchema>;
export type ProductOption = z.infer<typeof ProductOptionSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductSummary = z.infer<typeof ProductSummarySchema>;
export type ProductSort = z.infer<typeof ProductSortSchema>;
export type ProductListQuery = z.infer<typeof ProductListQuerySchema>;
export type ProductPage = z.infer<typeof ProductPageSchema>;
