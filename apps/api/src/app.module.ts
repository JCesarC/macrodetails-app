import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validateEnv, type Env } from './config/env.js';
import { CatalogModule } from './modules/catalog/index.js';
import { HealthModule } from './modules/health/health.module.js';
import { StorageModule } from './modules/storage/index.js';
import { VendorsModule } from './modules/vendors/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        uri: config.get('MONGODB_URI', { infer: true }),
      }),
    }),
    HealthModule,
    StorageModule,
    VendorsModule,
    CatalogModule,
  ],
})
export class AppModule {}
