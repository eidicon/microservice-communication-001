import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc-options.client';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    grpcClientOptions,
  );
  app.useGlobalPipes(new ValidationPipe());
  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
