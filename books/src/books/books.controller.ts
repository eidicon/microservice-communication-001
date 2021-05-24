import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundInterceptor } from './interceptors/not-found.interceptor';
import { Book } from './schemas/book.schema';
import { PipeObjectId } from './validation/object-id.pipe';

@Controller('api/v1/books')
@UseInterceptors(NotFoundInterceptor)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', PipeObjectId) id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', PipeObjectId) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id', PipeObjectId) id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}
