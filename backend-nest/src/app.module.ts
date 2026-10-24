import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [DatabaseModule, ExpensesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
