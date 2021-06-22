import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksModule } from './books/books.module';
import { AuthorsModule } from './author/author.module';

@Module({
  imports: [
    BooksModule,
    AuthorsModule,
    MongooseModule.forRoot('mongodb://mongodb:27017/books'),
  ],
})
export class AppModule {}
