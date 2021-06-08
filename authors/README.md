# Authors API

## Description

Authors Service

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

how to test grcp:
- install test clinet:
```npm i -g grpcc```
- run against your microservice:
_provide path to your proto file _
```
cd ~/......./myAwesomeService
grpcc -i --proto ./src/authors/authors.proto --address localhost:5000
```
usage :
```
client.findAll({}, printReply)
client.findOne({id: "some_id"}, printReply)
client.create({firstName: "FNPB", lastName: "LMPB", age: 34, biography: "created from protobuff", numberOfBooks: 2}, printReply)
client.update({id: "60bb6b11b9d34aee145126f1", firstName: "FNPB3"}, printReply)
client.remove({id: "60bb6b11b9d34aee145126f1"}, printReply)
```



