import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './schemas/author.schema';
import { BookAuthorDto } from './dto/book-author.dto';
import { Book } from './schemas/book.schema';
import { NoResponseError } from './errors/no-respons.error';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface BooksList {
  data: Book[];
}

interface AuthorsService {
  findOne(data: { id: string }): Observable<Author>;
  findAll(params: unknown): Observable<Author[]>;
  create(data: CreateAuthorDto): Observable<Author>;
  update(data: UpdateAuthorDto): Observable<Author>;
}

interface BooksService {
  findOne(data: { id: string }): Observable<Book>;
  findAll(params: unknown): Observable<BooksList>;
  create(data: CreateBookDto): Observable<Book>;
}

@Injectable()
export class DashboardService implements OnModuleInit {
  private authorsService: AuthorsService;

  private booksService: BooksService;

  constructor(
    @Inject('AUTHORS_PACKAGE') private authorsClient: ClientGrpc,
    @Inject('BOOKS_PACKAGE') private booksClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authorsService =
      this.authorsClient.getService<AuthorsService>('AuthorsService');
    this.booksService =
      this.booksClient.getService<BooksService>('BooksService');
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const response = await this.authorsService
      .create(createAuthorDto)
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response;
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const response = await this.booksService.create(createBookDto).toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response;
  }

  async findAllAuthors(): Promise<Author[]> {
    const response = await this.authorsService.findAll({}).toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response;
  }

  async findAllBooks(): Promise<any> {
    const booksList = await this.booksService.findAll({}).toPromise();

    if (!booksList) {
      throw new NoResponseError();
    }

    return this.populateAuthorsToBooks(booksList.data);
  }

  findOneAuthor(id: string) {
    return this.getAuthorById(id);
  }

  async findOneBook(id: string): Promise<BookAuthorDto> {
    const book = await this.booksService.findOne({ id }).toPromise();

    if (!book) {
      throw new NoResponseError();
    }

    const [bookView] = await this.populateAuthorsToBooks([book]);
    return bookView;
  }

  async updateAuthor(id: string, updateAuthorDto: UpdateAuthorDto) {
    const updatedAuthor = await this.authorsService.update({
      id,
      ...updateAuthorDto,
    });

    if (!updatedAuthor) {
      throw new NoResponseError();
    }

    return updatedAuthor;
  }

  private async populateAuthorsToBooks(
    booksList: Book[],
  ): Promise<BookAuthorDto[]> {
    return Promise.all(
      booksList.map(async (book) => {
        let author;

        try {
          author = await this.getAuthorById(book.authorId);
        } catch (err) {
          // TODO: just log that author unknown
          //do not fail if author not found
        }

        if (!author) {
          return {
            ...book,
            firstName: undefined,
            lastName: undefined,
          } as BookAuthorDto;
        }

        return {
          ...book,
          firstName: author.firstName,
          lastName: author.lastName,
        } as BookAuthorDto;
      }),
    );
  }

  private async getAuthorById(authorId: string): Promise<Author> {
    const response = await this.authorsService
      .findOne({
        id: authorId,
      })
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response;
  }
}
