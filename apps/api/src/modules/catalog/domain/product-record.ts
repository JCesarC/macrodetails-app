import type {
  Allergen,
  Category,
  Money,
  Occasion,
  ProductImage,
  ProductOption,
  ProductSort,
} from '@macrodetails/contracts';

/** A product as the catalog stores it: it references its vendor by id only. */
export interface ProductRecord {
  id: string;
  slug: string;
  vendorId: string;
  name: string;
  description: string;
  category: Category;
  occasions: Occasion[];
  tags: string[];
  price: Money;
  images: ProductImage[];
  options: ProductOption[];
  allergens: Allergen[];
  leadTimeHours: number;
  createdAt: Date;
}

export interface ProductSearchCriteria {
  text?: string;
  category?: Category;
  occasion?: Occasion;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: ProductSort;
  page: number;
  limit: number;
}

export interface ProductSearchResult {
  items: ProductRecord[];
  total: number;
}
