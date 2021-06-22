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
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
