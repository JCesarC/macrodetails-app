import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model, type QueryFilter, type SortOrder } from 'mongoose';
import type { ProductOption, ProductSort } from '@macrodetails/contracts';
import type {
  ProductRecord,
  ProductSearchCriteria,
  ProductSearchResult,
} from '../domain/product-record.js';
import { ProductRepository } from '../domain/product.repository.js';
import { PRODUCT_MODEL, type ProductDocument } from './product.schema.js';

type ProductRow = ProductDocument & { _id: Types.ObjectId; createdAt: Date };

@Injectable()
export class MongoProductRepository extends ProductRepository {
  constructor(@InjectModel(PRODUCT_MODEL) private readonly model: Model<ProductDocument>) {
    super();
  }

  async search(criteria: ProductSearchCriteria): Promise<ProductSearchResult> {
    const filter = buildFilter(criteria);
    const useTextScore = Boolean(criteria.text) && criteria.sort === 'relevance';
    const projection = useTextScore ? { score: { $meta: 'textScore' } } : {};

    const [rows, total] = await Promise.all([
      this.model
        .find(filter, projection)
        .sort(sortFor(criteria.sort, useTextScore))
        .skip((criteria.page - 1) * criteria.limit)
        .limit(criteria.limit)
        .lean<ProductRow[]>(),
      this.model.countDocuments(filter),
    ]);

    return { items: rows.map(toRecord), total };
  }

  async findBySlug(slug: string): Promise<ProductRecord | null> {
    const row = await this.model.findOne({ slug, active: true }).lean<ProductRow>();
    return row ? toRecord(row) : null;
  }
}

function buildFilter(criteria: ProductSearchCriteria): QueryFilter<ProductDocument> {
  const filter: QueryFilter<ProductDocument> = { active: true };

  if (criteria.text) filter.$text = { $search: criteria.text };
  if (criteria.category) filter.category = criteria.category;
  if (criteria.occasion) filter.occasions = criteria.occasion;
  if (criteria.vendorId) filter.vendorId = new Types.ObjectId(criteria.vendorId);
  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    filter['price.amount'] = {
      ...(criteria.minPrice !== undefined && { $gte: criteria.minPrice }),
      ...(criteria.maxPrice !== undefined && { $lte: criteria.maxPrice }),
    };
  }
  return filter;
}

function sortFor(
  sort: ProductSort,
  useTextScore: boolean,
): Record<string, SortOrder | { $meta: 'textScore' }> {
  switch (sort) {
    case 'price-asc':
      return { 'price.amount': 1, _id: 1 };
    case 'price-desc':
      return { 'price.amount': -1, _id: 1 };
    case 'newest':
      return { createdAt: -1, _id: 1 };
    case 'relevance':
      return useTextScore ? { score: { $meta: 'textScore' }, _id: 1 } : { createdAt: -1, _id: 1 };
  }
}

function toRecord(row: ProductRow): ProductRecord {
  return {
    id: row._id.toString(),
    slug: row.slug,
    vendorId: row.vendorId.toString(),
    name: row.name,
    description: row.description,
    category: row.category,
    occasions: row.occasions as ProductRecord['occasions'],
    tags: row.tags,
    price: { amount: row.price.amount, currency: 'MXN' },
    images: row.images.map((image) => ({ url: image.url ?? '', alt: image.alt ?? '' })),
    options: row.options as ProductOption[],
    allergens: row.allergens as ProductRecord['allergens'],
    leadTimeHours: row.leadTimeHours,
    createdAt: row.createdAt,
  };
}
