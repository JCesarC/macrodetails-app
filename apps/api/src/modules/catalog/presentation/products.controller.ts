import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  ProductListQuerySchema,
  ProductPageSchema,
  ProductSchema,
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

  @Get()
  @ApiOperation({ summary: 'List active products with search, filters, sorting and pagination' })
  @ApiOkResponse({
    description: 'One page of matching products',
    standardSchema: ProductPageSchema,
  })
  list(
    @Query({ schema: ProductListQuerySchema }) query: ProductListQuery,
  ): Promise<Page<ProductSummary>> {
    return this.listProducts.execute(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get an active product by slug' })
  @ApiOkResponse({ description: 'The product with its options', standardSchema: ProductSchema })
  @ApiNotFoundResponse({ description: 'No active product has this slug' })
  async getBySlug(@Param('slug', { schema: SlugSchema }) slug: string): Promise<Product> {
    const product = await this.getProduct.execute(slug);
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product;
  }
}
