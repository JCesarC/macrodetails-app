import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupOpenApi(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('MacroDetails API')
    .setDescription('Catalog, vendors and health endpoints of the MacroDetails gift marketplace.')
    .setVersion('1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, { jsonDocumentUrl: 'api/openapi.json' });
}
