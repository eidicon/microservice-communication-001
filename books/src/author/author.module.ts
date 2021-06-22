import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Author, AuthorSchema } from './schemas/author.schema';
import { AuthorService } from './author.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
  controllers: [AuthorService],
})
export class AuthorsModule {}
