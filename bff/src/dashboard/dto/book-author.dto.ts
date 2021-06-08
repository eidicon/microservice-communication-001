import { Author } from '../schemas/author.schema';
import { Book } from '../schemas/book.schema';

export type BookAuthorDto = Book & Author;
