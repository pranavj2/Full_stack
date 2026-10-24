import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //removes properties that have no validation decorators.
      forbidNonWhitelisted: true, //rejects requests containing unexpected properties.
      transform: true, //enables transformation of incoming values where the DTO and transformation rules support it.
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
