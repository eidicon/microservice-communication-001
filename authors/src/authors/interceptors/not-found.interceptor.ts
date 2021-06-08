import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  NotFoundException,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { status } from '@grpc/grpc-js';

export class DocumentNotFoundError extends Error {
  private code: number;
  private metadata: string;
  constructor() {
    super();
    this.message = 'not_found';
    this.code = status.NOT_FOUND;
    this.metadata = 'jhgjhgjh';
  }
}

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof DocumentNotFoundError) {
          throw new NotFoundException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
