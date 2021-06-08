import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { DocumentNotFoundError } from './interceptors/not-found.interceptor';
import { Author } from './schemas/author.schema';

@Controller()
export class AuthorsService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  /**
   * @description creates document
   * @param {string} id
   * @param {CreateAuthorDto} createAuthorDto
   * @returns {Promise<Author>}
   */
  @GrpcMethod()
  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorModel.create(createAuthorDto);
  }

  /**
   * @description returns all documents
   * @returns {Promise<Author[]>}
   */
  @GrpcMethod()
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
  @GrpcMethod()
  async findOne(data: { id: string }): Promise<Author> {
    const author = await this.authorModel.findById(data.id).exec();
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
  @GrpcMethod()
  async update(data: { id: string; fields: UpdateAuthorDto }): Promise<Author> {
    const { id, ...fields } = data;
    const updatedAuthor = await this.authorModel.findByIdAndUpdate(
      id,
      { ...fields },
      {
        new: true,
      },
    );

    if (!updatedAuthor) throw new DocumentNotFoundError();

    return updatedAuthor;
  }

  /**
   * @description removes document by given id
   * @param {string} id
   * @throws {DocumentNotFoundError}
   * @returns {Promise<any>}
   */
  @GrpcMethod()
  async remove(data: { id: string }): Promise<any> {
    const result = await this.authorModel.deleteOne({ _id: data.id });
    if (!result.deletedCount) throw new DocumentNotFoundError();

    return;
  }
}
