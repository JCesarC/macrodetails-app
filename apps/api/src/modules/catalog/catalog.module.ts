import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorsModule } from '../vendors/index.js';
import { GetProductUseCase } from './application/get-product.use-case.js';
import { ListProductsUseCase } from './application/list-products.use-case.js';
import { ProductRepository } from './domain/product.repository.js';
import { MongoProductRepository } from './infrastructure/mongo-product.repository.js';
import { PRODUCT_MODEL, ProductSchema } from './infrastructure/product.schema.js';
import { ProductsController } from './presentation/products.controller.js';

@Module({
  imports: [
    VendorsModule,
    MongooseModule.forFeature([{ name: PRODUCT_MODEL, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    ListProductsUseCase,
    GetProductUseCase,
    { provide: ProductRepository, useClass: MongoProductRepository },
  ],
})
export class CatalogModule {}
