import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { DocumentNotFoundError } from './interceptors/not-found.interceptor';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  /**
   * @description creates document
   * @param {string} id
   * @param {CreateAuthorDto} createAuthorDto
   * @returns {Promise<Author>}
   */
  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorModel.create(createAuthorDto);
  }

  /**
   * @description returns all documents
   * @returns {Promise<Author[]>}
   */
  async findAll(): Promise<Author[]> {
    return this.authorModel.find().exec();
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

    return author;
  }

  /**
   * @description updates document
   * @param {string} id
   * @param {UpdateAuthorDto} updateAuthorDto
   * @throws {DocumentNotFoundError}
   * @returns {Promise<Author>}
   */
  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const updatedAuthor = await this.authorModel.findByIdAndUpdate(
      id,
      updateAuthorDto,
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
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    const result = await this.authorModel.deleteOne({ _id: id });
    if (!result.deletedCount) throw new DocumentNotFoundError();

    return;
  }
}
