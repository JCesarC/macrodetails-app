import { Schema, type InferSchemaType } from 'mongoose';

export const VENDOR_MODEL = 'Vendor';

export const VendorSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    city: { type: String, required: true },
    logoUrl: { type: String, default: null },
    leadTimeHours: { type: Number, required: true, min: 0 },
    dailyCapacity: { type: Number, required: true, min: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'vendors' },
);

export type VendorDocument = InferSchemaType<typeof VendorSchema>;
