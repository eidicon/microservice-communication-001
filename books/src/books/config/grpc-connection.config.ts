import { registerAs } from '@nestjs/config';

export default registerAs('grpcConnection', () => ({
  authors: process.env.AUTHORS_GRPC_CONNECTION_URL,
}));
