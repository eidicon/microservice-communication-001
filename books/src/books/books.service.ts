import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DocumentNotFoundError } from './interceptors/not-found.interceptor';
import { Book, BookDocument } from './schemas/book.schema';

interface IFunction {
  (authorId: string, existedNumberOfBooks: string): Promise<void>;
}

const authorsEndpoint =
  process.env.AUTHORS_ENDPOINT || 'http://localhost:8091/api/v1/authors';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private http: HttpService,
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
      await this.updateAuthorsBookCount(
        createBookDto.authorId,
        this.increaseNumberOfBooks.bind(this),
      );
    } catch (err) {
      console.log(aNewBook);
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
  findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  /**
   * @description returns one existing document
   * @param {string} id
   * @throws {DocumentNotFoundError}
   * @returns {Promise<BookDocument>}
   */
  async findOne(id: string): Promise<BookDocument> {
    const book = await this.bookModel.findById(id).exec();
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

    return updatedBook;
  }

  /**
   * @description removes existing document
   * @param {string} id
   * @throws {DocumentNotFoundError}
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    // TODO: add fallback
    const bookDocument = await this.bookModel.findById(id);
    const result = await this.bookModel.deleteOne({ _id: id });
    if (!result.deletedCount) throw new DocumentNotFoundError();
    await this.updateAuthorsBookCount(
      bookDocument.authorId,
      this.decreaseNumberOfBooks.bind(this),
    );

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
    const response = await this.http
      .get(`${authorsEndpoint}/${authorId}`)
      .toPromise();

    if (!response || !response.data || !response.data.numberOfBooks) {
      throw new Error('Cannot get number of books from response');
    }

    await action(authorId, response.data.numberOfBooks);
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
    existedNumberOfBooks: string,
  ): Promise<void> {
    await this.http
      .put(`${authorsEndpoint}/${authorId}`, {
        numberOfBooks: +existedNumberOfBooks + 1,
      })
      .toPromise();
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

    await this.http
      .put(`${authorsEndpoint}/${authorId}`, {
        numberOfBooks: +existedNumberOfBooks - 1,
      })
      .toPromise();
  }
}
