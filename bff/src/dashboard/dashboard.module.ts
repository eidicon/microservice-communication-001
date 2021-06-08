import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DashboardService } from './dashboard.service';
import grpcConnectionConfig from './config/grcp-connection.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [grpcConnectionConfig],
    }),
  ],
  controllers: [DashboardController],
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
    {
      provide: 'BOOKS_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'books',
            protoPath: join(__dirname, './protos/books.proto'),
            url: configService.get<string>('grpcConnection.books'),
          },
        });
      },
      inject: [ConfigService],
    },
    DashboardService,
  ],
})
export class DashboardModule {}
