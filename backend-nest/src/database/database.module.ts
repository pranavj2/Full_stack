import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseController } from './database.controller.js';
import { PG_POOL } from './database.constants.js';

@Module({
  controllers: [DatabaseController],
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => {
        const pool = new Pool({
          host: process.env.DB_HOST ?? 'localhost',
          port: Number(process.env.DB_PORT ?? 5432),
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        });

        pool.on('error', (error) => {
          console.error('Unexpected PostgreSQL pool error:', error);
        });

        return pool;
      },
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
