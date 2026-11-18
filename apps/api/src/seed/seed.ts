import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { AppModule } from '../app.module.js';
import {
  PRODUCT_MODEL,
  type ProductDocument,
} from '../modules/catalog/infrastructure/product.schema.js';
import { ObjectStorage, StorageNotConfiguredError } from '../modules/storage/index.js';
import {
  VENDOR_MODEL,
  type VendorDocument,
} from '../modules/vendors/infrastructure/vendor.schema.js';
import { products } from './data/products.js';
import { vendors } from './data/vendors.js';
import { SeedProductSchema, SeedVendorSchema } from './seed-schemas.js';

const ASSETS_DIR = join(import.meta.dirname, '..', '..', 'seed-assets', 'products');
const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

/**
 * Idempotent demo seed: upserts vendors and products by slug.
 * Photos placed in seed-assets/products/<product-slug>/ are uploaded to the
 * media bucket when storage is configured; otherwise existing images are kept.
 */
async function main() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const vendorModel = app.get<Model<VendorDocument>>(getModelToken(VENDOR_MODEL), {
      strict: false,
    });
    const productModel = app.get<Model<ProductDocument>>(getModelToken(PRODUCT_MODEL), {
      strict: false,
    });
    const storage = app.get(ObjectStorage, { strict: false });

    const vendorIds = new Map<string, unknown>();
    for (const raw of vendors) {
      const vendor = SeedVendorSchema.parse(raw);
      const doc = await vendorModel.findOneAndUpdate({ slug: vendor.slug }, vendor, {
        upsert: true,
        returnDocument: 'after',
      });
      vendorIds.set(vendor.slug, doc._id);
    }
    logger.log(`Vendors upserted: ${vendorIds.size}`);

    let withPhotos = 0;
    for (const raw of products) {
      const { vendorSlug, imageAlt, ...product } = SeedProductSchema.parse(raw);
      const vendorId = vendorIds.get(vendorSlug);
      if (!vendorId)
        throw new Error(`Product "${product.slug}" references unknown vendor "${vendorSlug}"`);

      const images = await uploadPhotos(storage, product.slug, imageAlt, logger);
      if (images) withPhotos++;

      await productModel.updateOne(
        { slug: product.slug },
        {
          $set: { ...product, vendorId, active: true, ...(images && { images }) },
          $setOnInsert: images ? {} : { images: [] },
        },
        { upsert: true },
      );
    }
    await productModel.syncIndexes();
    logger.log(`Products upserted: ${products.length} (${withPhotos} with new photos)`);
  } finally {
    await app.close();
  }
}

async function uploadPhotos(
  storage: ObjectStorage,
  slug: string,
  alt: string,
  logger: Logger,
): Promise<{ url: string; alt: string }[] | null> {
  const dir = join(ASSETS_DIR, slug);
  const files = (await readdir(dir).catch(() => []))
    .filter((file) => extname(file).toLowerCase() in CONTENT_TYPES)
    .sort();
  if (files.length === 0) return null;

  try {
    const images = [];
    for (const file of files) {
      const { publicUrl } = await storage.putObject({
        key: `products/${slug}/${file}`,
        body: await readFile(join(dir, file)),
        contentType: CONTENT_TYPES[extname(file).toLowerCase()]!,
      });
      images.push({ url: publicUrl, alt });
    }
    return images;
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      logger.warn(`Skipping photos for "${slug}": ${error.message}`);
      return null;
    }
    throw error;
  }
}

await main();
