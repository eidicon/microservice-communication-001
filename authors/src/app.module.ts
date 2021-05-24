import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    AuthorsModule,
    MongooseModule.forRoot('mongodb://mongodb:27017/authors'),
  ],
})
export class AppModule {}
