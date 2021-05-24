import { HttpService, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorDocument } from './schemas/author.schema';
import { BookAuthorDto } from './dto/book-author.dto';
import { BookDocument } from './schemas/book.schema';
import { NoResponseError } from './errors/no-respons.error';

const authorsEndpoint =
  process.env.AUTHORS_ENDPOINT || 'http://localhost:8091/api/v1/authors';
const booksEndpoint =
  process.env.BOOKS_ENDPOINT || 'http://localhost:8092/api/v1/authors';

@Injectable()
export class DashboardService {
  constructor(private http: HttpService) {}

  async createAuthor(
    createAuthorDto: CreateAuthorDto,
  ): Promise<AuthorDocument> {
    const response = await this.http
      .post(`${authorsEndpoint}`, createAuthorDto)
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response.data;
  }

  async createBook(createBookDto: CreateBookDto): Promise<BookDocument> {
    const response = await this.http
      .post(`${booksEndpoint}`, createBookDto)
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response.data;
  }

  async findAllAuthors(): Promise<AuthorDocument[]> {
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

    return this.populateAuthorsToBooks(booksList.data);
  }

  findOneAuthor(id: string) {
    return this.getAuthorById(id);
  }

  async findOneBook(id: string): Promise<BookAuthorDto> {
    const booksList = await this.http.get(`${booksEndpoint}/${id}`).toPromise();

    if (!booksList) {
      throw new NoResponseError();
    }

    const [bookView] = await this.populateAuthorsToBooks([booksList.data]);
    return bookView;
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

  private async populateAuthorsToBooks(
    booksList: BookDocument[],
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

  private async getAuthorById(authorId: string): Promise<AuthorDocument> {
    const response = await this.http
      .get(`${authorsEndpoint}/${authorId}`)
      .toPromise();

    if (!response) {
      throw new NoResponseError();
    }

    return response.data;
  }
}
