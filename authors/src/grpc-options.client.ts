import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'authors',
    protoPath: join(__dirname, './authors/authors.proto'),
    url: '0.0.0.0:50051',
  },
};
