import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorDirectory } from './application/vendor-directory.js';
import { VendorRepository } from './domain/vendor.repository.js';
import { MongoVendorRepository } from './infrastructure/mongo-vendor.repository.js';
import { VENDOR_MODEL, VendorSchema } from './infrastructure/vendor.schema.js';
import { VendorsController } from './presentation/vendors.controller.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: VENDOR_MODEL, schema: VendorSchema }])],
  controllers: [VendorsController],
  providers: [VendorDirectory, { provide: VendorRepository, useClass: MongoVendorRepository }],
  exports: [VendorDirectory],
})
export class VendorsModule {}
