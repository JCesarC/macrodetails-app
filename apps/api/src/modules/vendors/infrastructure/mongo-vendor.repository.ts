import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, type Model, type Types } from 'mongoose';
import type { Vendor } from '@macrodetails/contracts';
import { VendorRepository } from '../domain/vendor.repository.js';
import { VENDOR_MODEL, type VendorDocument } from './vendor.schema.js';

type VendorRow = VendorDocument & { _id: Types.ObjectId };

@Injectable()
export class MongoVendorRepository extends VendorRepository {
  constructor(@InjectModel(VENDOR_MODEL) private readonly model: Model<VendorDocument>) {
    super();
  }

  async findActive(): Promise<Vendor[]> {
    const rows = await this.model.find({ active: true }).sort({ name: 1 }).lean<VendorRow[]>();
    return rows.map(toVendor);
  }

  async findBySlug(slug: string): Promise<Vendor | null> {
    const row = await this.model.findOne({ slug, active: true }).lean<VendorRow>();
    return row ? toVendor(row) : null;
  }

  async findByIds(ids: readonly string[]): Promise<Vendor[]> {
    const validIds = ids.filter((id) => isValidObjectId(id));
    const rows = await this.model.find({ _id: { $in: validIds } }).lean<VendorRow[]>();
    return rows.map(toVendor);
  }
}

function toVendor(row: VendorRow): Vendor {
  return {
    id: row._id.toString(),
    slug: row.slug,
    name: row.name,
    description: row.description,
    city: row.city,
    logoUrl: row.logoUrl ?? null,
    leadTimeHours: row.leadTimeHours,
    dailyCapacity: row.dailyCapacity,
    active: row.active,
  };
}
