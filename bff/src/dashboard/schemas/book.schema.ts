import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  readonly authorId: string;

  @Prop()
  readonly title: string;

  @Prop()
  readonly description: string;
}
