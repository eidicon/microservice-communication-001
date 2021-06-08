import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '@nestjs/microservices';

import { AuthorsService } from './authors.service';
import { Author, AuthorSchema } from './schemas/author.schema';
import { grpcClientOptions } from '../grpc-options.client';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    ClientsModule.register([
      {
        name: 'AUTHOR_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [AuthorsService],
})
export class AuthorsModule {}
