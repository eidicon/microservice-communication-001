import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  readonly authorId: string;

  @Prop()
  readonly title: string;

  @Prop()
  readonly description: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
