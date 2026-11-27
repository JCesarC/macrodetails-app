import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { HealthResponseSchema, type HealthResponse } from '@macrodetails/contracts';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Report the service status and the state of its dependencies' })
  @ApiOkResponse({ description: 'Every dependency is up', standardSchema: HealthResponseSchema })
  @ApiServiceUnavailableResponse({
    description: 'At least one dependency is down',
    standardSchema: HealthResponseSchema,
  })
  check(): HealthResponse {
    const health = this.healthService.check();
    if (health.status !== 'ok') {
      throw new ServiceUnavailableException(health);
    }
    return health;
  }
}
