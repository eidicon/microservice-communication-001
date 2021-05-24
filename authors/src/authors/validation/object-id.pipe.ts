import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { DocumentNotFoundError } from '../interceptors/not-found.interceptor';

@Injectable()
export class PipeObjectId implements PipeTransform {
  transform(value: any) {
    const isValid = isValidObjectId(value);
    if (!isValid) throw new DocumentNotFoundError();

    return value;
  }
}
