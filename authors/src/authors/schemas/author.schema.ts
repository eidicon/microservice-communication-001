import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthorDocument = Author & Document;

@Schema({
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
})
export class Author {
  @Prop()
  readonly firstName: string;

  @Prop()
  readonly lastName: string;

  @Prop()
  readonly age: number;

  @Prop()
  readonly biography: string;

  @Prop()
  readonly numberOfBooks: number;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
