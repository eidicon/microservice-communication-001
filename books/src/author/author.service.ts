import { Controller, InternalServerErrorException } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentNotFoundError } from 'src/books/interceptors/not-found.interceptor';
import { UpsertAuthorDto } from './dto/upsert-author.dto';

//import { UpsertAuthorDto } from './dto/upsert-author.dto';
//import { DocumentNotFoundError } from './interceptors/not-found.interceptor';
import { Author, AuthorDocument } from './schemas/author.schema';

@Controller()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  @MessagePattern('author-updated')
  async updateAuthorHandler(
    @Payload() data: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const parsedData = JSON.parse(data);
      await this.upsertAuthor(parsedData, context);
    } catch (err) {
      console.log(err);
    }
  }

  @MessagePattern('author-created')
  async createAuthorHandler(
    @Payload() data: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const parsedData = JSON.parse(data);
      await this.upsertAuthor(parsedData, context);
    } catch (err) {
      console.log(err);
    }
  }

  private async upsertAuthor(authorData: UpsertAuthorDto, context: RmqContext) {
    try {
      const author = await this.authorModel.findByIdAndUpdate(
        authorData._id,
        { firstName: authorData.firstName, lastName: authorData.lastName },
        {
          new: true,
          upsert: true,
        },
      );

      if (!author) throw new DocumentNotFoundError();

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
