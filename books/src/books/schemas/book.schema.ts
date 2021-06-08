import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
})
export class Book {
  @Prop()
  readonly authorId: string;

  @Prop()
  readonly title: string;

  @Prop()
  readonly description: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
