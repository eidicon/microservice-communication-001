import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/book.schema';
import { grpcClientOptions } from '../grpc-options.client';
import grpcConnectionConfig from './config/grpc-connection.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    ClientsModule.register([
      {
        name: 'BOOKS_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
    ConfigModule.forRoot({
      load: [grpcConnectionConfig],
    }),
  ],
  controllers: [BooksService],
  providers: [
    {
      provide: 'AUTHORS_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'authors',
            protoPath: join(__dirname, './protos/authors.proto'),
            url: configService.get<string>('grpcConnection.authors'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class BooksModule {}
