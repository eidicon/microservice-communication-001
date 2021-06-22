import { HttpService, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './schemas/author.schema';
import { BookAuthorDto } from './dto/book-author.dto';
import { Book } from './schemas/book.schema';
import { NoResponseError } from './errors/no-respons.error';

const authorsEndpoint =
  process.env.AUTHORS_ENDPOINT || 'http://localhost:8091/api/v1/authors';
const booksEndpoint =
  process.env.BOOKS_ENDPOINT || 'http://localhost:8092/api/v1/authors';

@Injectable()
export class DashboardService {
  constructor(private http: HttpService) {}

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const response = await this.http
      .post(`${authorsEndpoint}`, createAuthorDto)
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response.data;
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const response = await this.http
      .post(`${booksEndpoint}`, createBookDto)
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response.data;
  }

  async findAllAuthors(): Promise<Author[]> {
    const response = await this.http.get(`${authorsEndpoint}`).toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response.data;
  }

  async findAllBooks(): Promise<BookAuthorDto[]> {
    const booksList = await this.http.get(`${booksEndpoint}`).toPromise();

    if (!booksList) {
      throw new NoResponseError();
    }

    return booksList;
  }

  async findOneAuthor(id: string): Promise<Author> {
    const response = await this.http
      .get(`${authorsEndpoint}/${id}`)
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response.data;
  }

  async findOneBook(id: string): Promise<BookAuthorDto> {
    const book = await this.http.get(`${booksEndpoint}/${id}`).toPromise();

    if (!book) {
      throw new NoResponseError();
    }

    return book;
  }

  async updateAuthor(id: string, updateAuthorDto: UpdateAuthorDto) {
    const updatedAuthor = await this.http
      .put(`${authorsEndpoint}/${id}`, updateAuthorDto)
      .toPromise();

    if (!updatedAuthor) {
      throw new NoResponseError();
    }

    return updatedAuthor.data;
  }
}
