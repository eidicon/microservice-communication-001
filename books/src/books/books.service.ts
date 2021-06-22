import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DocumentNotFoundError } from './interceptors/not-found.interceptor';
import { Book, BookDocument } from './schemas/book.schema';
import { Author, AuthorDocument } from 'src/author/schemas/author.schema';
import { ExtendedBookDto } from './dto/extended-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @Inject('BOOKS_AMQP_SERVICE') private readonly amqpClient: ClientProxy,
  ) {}

  /**
   * @description creates a new document
   * @param {string} id
   * @param {CreateBookDto} createBookDto
   * @returns {Promise<BookDocument>}
   */
  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    let aNewBook: BookDocument;

    try {
      aNewBook = await this.bookModel.create(createBookDto);
      await this.amqpClient
        .emit('book-created', JSON.stringify({ id: aNewBook.authorId }))
        .toPromise();

      return aNewBook;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * @description returns all existing documents
   * @returns {Promise<BookDocument[]>}
   */
  async findAll(): Promise<any> {
    const books = await this.bookModel.find().exec();
    return {
      data: books.map((book) => {
        return book.toJSON();
      }),
    };
  }

  /**
   * @description returns one existing document
   * @param {string} id
   * @throws {DocumentNotFoundError}
   * @returns {Promise<BookDocument>}
   */
  async findOne(id: string): Promise<IExtendedBook> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new DocumentNotFoundError();
    const localAuthor = await this.getAuthorById(book.authorId);
    return {
      ...book.toJSON(),
      authorsFirstName: localAuthor.firstName,
      authorsLastName: localAuthor.lastName,
    } as ExtendedBookDto;
  }

  /**
   * @description updates existing document
   * @param {string} id
   * @param {UpdateBookDto} updateBookDto
   * @throws {DocumentNotFoundError}
   * @returns {Promise<BookDocument>}
   */
  async update(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<BookDocument> {
    const updatedBook = await this.bookModel.findByIdAndUpdate(
      id,
      updateBookDto,
      {
        new: true,
      },
    );
    if (!updatedBook) throw new DocumentNotFoundError();
    this.amqpClient.send({ cmd: 'book-updated' }, updatedBook);

    return updatedBook;
  }

  private async getAuthorById(authorId: string): Promise<Author> {
    const localAuthor = await this.authorModel.findById(authorId).exec();
    if (!localAuthor) throw new DocumentNotFoundError();
    return localAuthor;
  }
}
