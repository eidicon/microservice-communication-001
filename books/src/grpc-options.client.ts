import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'books',
    protoPath: join(__dirname, './books/protos/books.proto'),
    url: '0.0.0.0:50052',
  },
};
