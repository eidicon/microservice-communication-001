# Distributed Systems and Communication Patterns

## Intro

- There're 3 microservices(MS) stubs implemented for you - books, authors and frontend.
- Authors and books microservices contain few pre-created records.
- Frontend MS should make a calls for both books and authors MS

## Useful information to start with

- All microservices are ready to be run as Docker images, you can find Dockerfile for each microservice and docker-compose.yml to start all microservices with ports binding.
- You can run microservices with docker-compose up command.
- Useful docker-compose commands:
    1. `docker-compose up --build` - builds, (re)creates, starts, and attaches to containers for a service.
    2. `docker-compose down` - Stops containers and removes containers, networks, volumes, and images created by up. 
- Existing docker-compose.yml file contains required microservices port bindings and dependencies:
    1. Authors MS is available by port 8091.
    2. Books MS is available by port 8092.
    3. Frontend MS is available by port 8093 and depends on Authors and Books
    4. RabbitMQ is available by ports 5672 and management port 15672. You can check management console with guest/guest as user/password.
- Protobuf files (.proto) could be placed in /src/main/proto folder

## Multiple microservice strategies

Those packages contain skeletons for simple NestJS services implementation.

For RMQ and gRPC use NestJS microservices package and combine multiple strategies and create [Hybrid Application](https://docs.nestjs.com/faq/hybrid-application).

Example:

```typescript
const app = await NestFactory.create(AppModule);
// microservice #1
const microserviceTcp = app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
  options: {
    port: 3001,
  },
});
// microservice #2
const microserviceRedis = app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:6379',
  },
});

await app.startAllMicroservicesAsync();
await app.listen(3001);
```

## Docs

- [NestJS documentation](https://docs.nestjs.com/)

## Guides

The following guides illustrate how to use some features concretely:

- [NestJS Microservices guides](https://docs.nestjs.com/microservices/basics)
- [NestJS CRUD generator](https://docs.nestjs.com/recipes/crud-generator)
- [RESTFull API with NestJS guide](https://medium.com/swlh/create-an-api-rest-with-nestjs-1954723e8234)

## GRPC

- [NestJS gRPC guide](https://docs.nestjs.com/microservices/grpc)
- [grpc-node repository](https://github.com/grpc/grpc-node)
- [grpc-loader for NodeJS](https://github.com/grpc/grpc-node/tree/master/packages/proto-loader)
- [Language Guide (proto3)](https://developers.google.com/protocol-buffers/docs/proto3#simple)

## RabbitMQ

- [NestJS RMQ guide](https://docs.nestjs.com/microservices/rabbitmq)
