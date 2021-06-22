import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { DocumentNotFoundError } from './interceptors/not-found.interceptor';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @Inject('AUTHORS_AMQP_SERVICE') private readonly amqpClient: ClientProxy,
  ) {}

  /**
   * @description creates document
   * @param {string} id
   * @param {CreateAuthorDto} createAuthorDto
   * @returns {Promise<Author>}
   */
  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const aNewAuthor = await this.authorModel.create(createAuthorDto);
    await this.amqpClient
      .emit('author-created', JSON.stringify(aNewAuthor))
      .toPromise();
    return aNewAuthor.toJSON();
  }

  /**
   * @description returns all documents
   * @returns {Promise<Author[]>}
   */
  async findAll(): Promise<any> {
    const authors = await this.authorModel.find().exec();
    return {
      data: authors.map((author) => {
        return author.toJSON();
      }),
    };
  }

  /**
   * @description returns one document by given Id
   * @param {string} id
   * @throws {DocumentNotFoundError}
   * @returns {Promise<Author>}
   */
  async findOne(id: string): Promise<Author> {
    const author = await this.authorModel.findById(id).exec();
    if (!author) throw new DocumentNotFoundError();

    return author.toJSON();
  }

  /**
   * @description updates document
   * @param {string} id
   * @param {UpdateAuthorDto} updateAuthorDto
   * @throws {DocumentNotFoundError}
   * @returns {Promise<Author>}
   */
  async update(id: string, fields: UpdateAuthorDto): Promise<Author> {
    const updatedAuthor = await this.authorModel.findByIdAndUpdate(id, fields, {
      new: true,
    });

    if (!updatedAuthor) throw new DocumentNotFoundError();
    await this.amqpClient
      .send('author-updated', JSON.stringify(updatedAuthor))
      .toPromise();

    return updatedAuthor;
  }

  async increaseNumberOfBooks(
    author: string,
    context: RmqContext,
  ): Promise<void> {
    try {
      const parsedAuthor = JSON.parse(author);
      const authorBefore = await this.findOne(parsedAuthor.id);
      const authorAfter = await this.authorModel.findByIdAndUpdate(
        parsedAuthor.id,
        {
          numberOfBooks: authorBefore.numberOfBooks + 1,
        },
        {
          new: true,
        },
      );

      if (!authorAfter) throw new DocumentNotFoundError();
      if (authorAfter.numberOfBooks - authorBefore.numberOfBooks !== 1) {
        throw new InternalServerErrorException(
          'Failed to increase numberOfBooks',
        );
      }
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
