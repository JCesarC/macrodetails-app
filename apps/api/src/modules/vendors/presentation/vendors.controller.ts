import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { SlugSchema, type Vendor } from '@macrodetails/contracts';
import { VendorDirectory } from '../application/vendor-directory.js';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly directory: VendorDirectory) {}

  @Get()
  async list(): Promise<{ items: Vendor[] }> {
    return { items: await this.directory.listActive() };
  }

  @Get(':slug')
  async getBySlug(@Param('slug', { schema: SlugSchema }) slug: string): Promise<Vendor> {
    const vendor = await this.directory.findBySlug(slug);
    if (!vendor) throw new NotFoundException(`Vendor "${slug}" not found`);
    return vendor;
  }
}
