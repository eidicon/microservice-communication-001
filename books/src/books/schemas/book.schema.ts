import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
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
