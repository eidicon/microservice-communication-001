import {
  Controller,
  Inject,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DocumentNotFoundError } from './interceptors/not-found.interceptor';
import { Author } from './schemas/author.schema';
import { Book, BookDocument } from './schemas/book.schema';
import { Observable } from 'rxjs';

interface IFunction {
  (authorId: string, existedNumberOfBooks: any): Promise<void>;
}

interface AuthorsService {
  findOne(data: { id: string }): Observable<Author>;
  update(data: UpdateAuthorDto): Observable<Author>;
}

@Controller()
export class BooksService implements OnModuleInit {
  private authorsService: AuthorsService;

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @Inject('AUTHORS_PACKAGE') private authorsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authorsService =
      this.authorsClient.getService<AuthorsService>('AuthorsService');
  }

  /**
   * @description creates a new document
   * @param {string} id
   * @param {CreateBookDto} createBookDto
   * @returns {Promise<BookDocument>}
   */
  @GrpcMethod()
  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    let aNewBook: BookDocument;

    try {
      aNewBook = await this.bookModel.create(createBookDto);
      await this.updateAuthorsBookCount(
        createBookDto.authorId,
        this.increaseNumberOfBooks.bind(this),
      );
    } catch (err) {
      if (aNewBook && aNewBook._id) {
        await this.bookModel.deleteOne({ _id: aNewBook._id });
      }
      throw new InternalServerErrorException();
    }

    return aNewBook;
  }

  /**
   * @description returns all existing documents
   * @returns {Promise<BookDocument[]>}
   */
  @GrpcMethod()
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
  @GrpcMethod()
  async findOne(data: { id: string }): Promise<BookDocument> {
    const book = await this.bookModel.findById(data.id).exec();
    if (!book) throw new DocumentNotFoundError();

    return book;
  }

  /**
   * @description updates existing document
   * @param {string} id
   * @param {UpdateBookDto} updateBookDto
   * @throws {DocumentNotFoundError}
   * @returns {Promise<BookDocument>}
   */
  @GrpcMethod()
  async update(data: {
    id: string;
    updateBookDto: UpdateBookDto;
  }): Promise<BookDocument> {
    const { id, ...fields } = data;
    const updatedBook = await this.bookModel.findByIdAndUpdate(
      id,
      { ...fields },
      {
        new: true,
      },
    );
    if (!updatedBook) throw new DocumentNotFoundError();

    return updatedBook;
  }

  /**
   * @description removes existing document
   * @param {string} id
   * @throws {DocumentNotFoundError}
   * @returns {Promise<void>}
   */
  @GrpcMethod()
  async remove(id: string): Promise<void> {
    // TODO: add fallback
    const bookDocument = await this.bookModel.findById(id);
    const result = await this.bookModel.deleteOne({ _id: id });
    if (!result.deletedCount) throw new DocumentNotFoundError();
    // await this.updateAuthorsBookCount(
    //   bookDocument.authorId,
    //   this.decreaseNumberOfBooks.bind(this),
    // );

    return;
  }

  /**
   * @description update number of authors books
   * @private
   * @param {string} authorId
   * @param {IFunction} action
   * @returns {Promise<void>}
   */
  private async updateAuthorsBookCount(
    authorId: string,
    action: IFunction,
  ): Promise<void> {
    const response: Author = await this.authorsService
      .findOne({ id: authorId })
      .toPromise();

    await action(authorId, response.numberOfBooks);
  }

  /**
   * @description increase number of authors books
   * @private
   * @param {string} authorId
   * @param {string} existedNumberOfBooks
   * @returns {Promise<void>}
   */
  private async increaseNumberOfBooks(
    authorId: string,
    existedNumberOfBooks: any,
  ): Promise<void> {
    await this.authorsService
      .update({
        id: authorId,
        numberOfBooks: +existedNumberOfBooks + 1,
      })
      .toPromise();
    return;
  }

  /**
   * @description decrease number of authors books
   * @private
   * @param {string} authorId
   * @param {string} existedNumberOfBooks
   * @returns {Promise<void>}
   */
  private async decreaseNumberOfBooks(
    authorId: string,
    existedNumberOfBooks: string,
  ): Promise<void> {
    if (+existedNumberOfBooks === 0) {
      return;
    }

    await this.authorsService.update({
      id: authorId,
      numberOfBooks: +existedNumberOfBooks - 1,
    });
  }
}
