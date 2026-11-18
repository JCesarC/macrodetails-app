import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../../config/env.js';
import { ObjectStorage } from './domain/object-storage.js';
import { S3ObjectStorage } from './infrastructure/s3-object-storage.js';
import { UnconfiguredObjectStorage } from './infrastructure/unconfigured-object-storage.js';

/**
 * No HTTP endpoints yet on purpose: issuing upload URLs requires
 * authentication, which arrives with the auth module.
 */
@Module({
  providers: [
    {
      provide: ObjectStorage,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>): ObjectStorage => {
        const bucket = config.get('MEDIA_BUCKET', { infer: true });
        const publicBaseUrl = config.get('MEDIA_BASE_URL', { infer: true });
        if (!bucket || !publicBaseUrl) return new UnconfiguredObjectStorage();

        return new S3ObjectStorage({
          region: config.get('AWS_REGION', { infer: true }),
          bucket,
          publicBaseUrl,
        });
      },
    },
  ],
  exports: [ObjectStorage],
})
export class StorageModule {}
