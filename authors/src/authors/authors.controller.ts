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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { NotFoundInterceptor } from './interceptors/not-found.interceptor';
import { Author } from './schemas/author.schema';
import { PipeObjectId } from './validation/object-id.pipe';

@Controller('/api/v1/authors')
@UseInterceptors(NotFoundInterceptor)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll(): Promise<Author[]> {
    return this.authorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', PipeObjectId) id: string): Promise<Author> {
    return this.authorsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', PipeObjectId) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id', PipeObjectId) id: string): Promise<void> {
    return this.authorsService.remove(id);
  }
}
