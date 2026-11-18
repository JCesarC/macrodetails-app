import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import type { DependencyStatus, HealthResponse } from '@macrodetails/contracts';
import { APP_INFO } from '../../app-info.js';

const MONGO_CONNECTED = 1;

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Pick<Connection, 'readyState'>) {}

  check(): HealthResponse {
    const checks: Record<string, DependencyStatus> = {
      mongo: this.connection.readyState === MONGO_CONNECTED ? 'up' : 'down',
    };
    const allUp = Object.values(checks).every((status) => status === 'up');

    return {
      status: allUp ? 'ok' : 'degraded',
      service: APP_INFO.service,
      version: APP_INFO.version,
      uptimeSeconds: Math.round(process.uptime()),
      checks,
    };
  }
}
