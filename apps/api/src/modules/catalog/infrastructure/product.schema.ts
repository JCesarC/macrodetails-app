import { Schema, type InferSchemaType } from 'mongoose';
import { ALLERGENS, CATEGORIES, OCCASIONS } from '@macrodetails/contracts';

export const PRODUCT_MODEL = 'Product';

const PriceSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['MXN'], default: 'MXN' },
  },
  { _id: false },
);

export const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, enum: CATEGORIES, required: true },
    occasions: { type: [String], enum: OCCASIONS, default: [] },
    tags: { type: [String], default: [] },
    price: { type: PriceSchema, required: true },
    images: { type: [{ _id: false, url: String, alt: String }], default: [] },
    // Options are validated by the shared Zod contract before they get here.
    options: { type: [Schema.Types.Mixed], default: [] },
    allergens: { type: [String], enum: ALLERGENS, default: [] },
    leadTimeHours: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'products' },
);

ProductSchema.index(
  { name: 'text', tags: 'text', description: 'text' },
  {
    weights: { name: 10, tags: 5, description: 1 },
    default_language: 'spanish',
    name: 'product_text',
  },
);
ProductSchema.index({ active: 1, category: 1, 'price.amount': 1 });
ProductSchema.index({ active: 1, occasions: 1 });

export type ProductDocument = InferSchemaType<typeof ProductSchema>;
