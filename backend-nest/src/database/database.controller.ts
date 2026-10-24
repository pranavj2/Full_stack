import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from './database.constants.js';

@Controller('health')
export class DatabaseController {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  @Get('db')
  async checkDatabase() {
    try {
      const result = await this.pool.query(
        'SELECT current_database() AS database',
      );

      return {
        success: true,
        database: result.rows[0].database,
      };
    } catch {
      throw new ServiceUnavailableException({
        success: false,
        message: 'Database connection or query failed',
      });
    }
  }
}
