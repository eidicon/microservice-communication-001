import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PipeObjectId } from './validation/object-id.pipe';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('authors')
  createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.dashboardService.createAuthor(createAuthorDto);
  }
  @Post('books')
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.dashboardService.createBook(createBookDto);
  }

  @Get('authors')
  findAllAuthors() {
    return this.dashboardService.findAllAuthors();
  }

  @Get('books')
  findAllBooks() {
    return this.dashboardService.findAllBooks();
  }

  @Get('authors/:id')
  findOneAuthor(@Param('id', PipeObjectId) id: string) {
    return this.dashboardService.findOneAuthor(id);
  }
  @Get('books/:id')
  findOneBook(@Param('id', PipeObjectId) id: string) {
    return this.dashboardService.findOneBook(id);
  }

  @Put('authors/:id')
  updateAuthor(
    @Param('id', PipeObjectId) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.dashboardService.updateAuthor(id, updateAuthorDto);
  }
}
