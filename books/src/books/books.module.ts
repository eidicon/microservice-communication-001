import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    HttpModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
