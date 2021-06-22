import { ClientOptions, Transport } from '@nestjs/microservices';

export const amqpClientOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://guest:guest@localhost:5672'],
    queue: 'authors_queue',
    queueOptions: {
      durable: false,
    },
    noAck: false,
  },
};
