import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { grpcClientOptions } from './grpc-options.client';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    grpcClientOptions,
  );
  app.useGlobalPipes(new ValidationPipe());
  app.listen(() => console.log('Microservice is listening'));
}

bootstrap();
