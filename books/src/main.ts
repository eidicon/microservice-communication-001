import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { amqpClientOptions } from './books/config/authors/amqp-options.client';

import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(amqpClientOptions);
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservicesAsync();
  await app.listenAsync(3002);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
