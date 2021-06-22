import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyFactory } from '@nestjs/microservices';

import { AuthorsService } from './authors.service';
import { Author, AuthorSchema } from './schemas/author.schema';
import { amqpClientOptions } from 'src/config/authors/amqp-options.client';
import { AuthorsController } from './authors.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
  controllers: [AuthorsController],
  providers: [
    {
      provide: 'AUTHORS_AMQP_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(amqpClientOptions);
      },
      inject: [ConfigService],
    },
    AuthorsService,
  ],
})
export class AuthorsModule {}
