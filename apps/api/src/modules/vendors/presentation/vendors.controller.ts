import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  SlugSchema,
  VendorListSchema,
  VendorSchema,
  type Vendor,
  type VendorList,
} from '@macrodetails/contracts';
import { VendorDirectory } from '../application/vendor-directory.js';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly directory: VendorDirectory) {}

  @Get()
  @ApiOperation({ summary: 'List active vendors' })
  @ApiOkResponse({ description: 'Every active vendor', standardSchema: VendorListSchema })
  async list(): Promise<VendorList> {
    return { items: await this.directory.listActive() };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get an active vendor by slug' })
  @ApiOkResponse({ description: 'The vendor profile', standardSchema: VendorSchema })
  @ApiNotFoundResponse({ description: 'No active vendor has this slug' })
  async getBySlug(@Param('slug', { schema: SlugSchema }) slug: string): Promise<Vendor> {
    const vendor = await this.directory.findBySlug(slug);
    if (!vendor) throw new NotFoundException(`Vendor "${slug}" not found`);
    return vendor;
  }
}
