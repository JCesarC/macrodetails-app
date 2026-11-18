import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import {
  ProductListQuerySchema,
  SlugSchema,
  type Page,
  type Product,
  type ProductListQuery,
  type ProductSummary,
} from '@macrodetails/contracts';
import { GetProductUseCase } from '../application/get-product.use-case.js';
import { ListProductsUseCase } from '../application/list-products.use-case.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  /** GET /api/v1/products?q=&category=&occasion=&vendor=&minPrice=&maxPrice=&sort=&page=&limit= */
  @Get()
  list(
    @Query({ schema: ProductListQuerySchema }) query: ProductListQuery,
  ): Promise<Page<ProductSummary>> {
    return this.listProducts.execute(query);
  }

  @Get(':slug')
  async getBySlug(@Param('slug', { schema: SlugSchema }) slug: string): Promise<Product> {
    const product = await this.getProduct.execute(slug);
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product;
  }
}
