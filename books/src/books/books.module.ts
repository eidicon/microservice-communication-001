import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '@nestjs/microservices';

import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/book.schema';
import { amqpClientOptions } from '../books/config/books/amqp-options.client';
import { BooksController } from './books.controller';
import { Author, AuthorSchema } from 'src/author/schemas/author.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
    ClientsModule.register([
      {
        name: 'BOOKS_AMQP_SERVICE',
        ...amqpClientOptions,
      },
    ]),
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
