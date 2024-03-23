<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

PostgreSQL module for Nest framework (node.js) 😻

## Installation

First install the module via `yarn` or `npm` or `pnpm` and do not forget to install the driver package as well:


```bash
    $ npm i --save nest-postgres pg
```
or

```bash
    $ yarn add nest-postgres pg
```

or

```bash
    $ pnpm add nest-postgres pg
```

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [PostgresModule](#postgresmodule)
  - [MultiConnectionsDatabase](#multi-connections-database)
  - [ExampleOfUse](#example-of-use)

## Usage

### PostgresModule

PostgresModule is the primary entry point for this package and can be used synchronously

```typescript
@Module({
  imports: [
    PostgresModule.forRoot({
        connectionString: 'postgresql://[user]:[password]@[host]/[nameDb]',
        // or 
        // host: 'localhost',
        // database: [:databaseName],
        // password: [:passwordDb],
        // user: [:userDb],
        // port: 5432,
    }),
  ],
})
```

or asynchronously

```typescript
@Module({
  imports: [
    PostgresModule.forRootAsync({
      useFactory: () => ({
        connectionString: 'postgresql://[user]:[password]@[host]/[nameDb]',
        // or 
        // host: 'localhost',
        // database: [:databaseName],
        // password: [:passwordDb],
        // user: [:userDb],
        // port: 5432,
      }),
    }),
  ],
})
```

## Example of use

UsersService:

```typescript
import { Client } from 'pg';
import { InjectClient } from 'nest-postgres';

@Injectable()
export class UsersService {
  constructor(@InjectClient() private readonly pg: Client) {}

  public async findAll(): Promise<User[]> {
    const users = await this.pg.query('SELECT * FROM users');
    return users.rows;
  }
}
```

UsersController:

```typescript
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
```

## Multi Connections Database

```typescript
@Module({
  imports: [
    PostgresModule.forRoot(
      {
        connectionString: 'postgresql://postgres:pass123@localhost:5432/nest1',
        // or 
        // host: 'localhost',
        // database: [:databaseName],
        // password: [:passwordDb],
        // user: [:userDb],
        // port: 5432,
      },
      'db1Connection',
    ),
    PostgresModule.forRoot(
      {
        connectionString: 'postgresql://postgres:pass123@localhost:5434/nest2',
      },
      'db2Connection',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

Usage example with Multi Connection

PostService:

```typescript
import { Client } from 'pg';
import { InjectConnection } from 'nest-postgres';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectConnection('db2Connection')
    private dbConnection: Client,
  ) {}

  public async findAll(): Promise<Post[]> {
    const users = await this.dbConnection.query('SELECT * FROM posts');
    return users.rows;
  }

  public async create(createPostDto: CreatePostDto): Promise<Post[]> {
    try {
      const user = await this.dbConnection.query(
        'INSERT INTO posts (title, description)  VALUES ($1, $2) RETURNING *',
        [createPostDto.title, createPostDto.description],
      );
      return user.rows;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
```

UsersService:

```typescript
import { Client } from 'pg';
import { InjectConnection } from 'nest-postgres';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('db1Connection')
    private dbConnection: Client,
  ) {}

  public async findAll(): Promise<User[]> {
    const users = await this.dbConnection.query('SELECT * FROM users');
    return users.rows;
  }

  public async create(createUserDto: CreateUserDto): Promise<User[]> {
    try {
      const user = await this.dbConnection.query(
        'INSERT INTO users (firstName, lastName)  VALUES ($1, $2) RETURNING *',
        [createUserDto.firstName, createUserDto.lastName],
      );
      return user.rows;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
```

For more information on `node-postgres` for Nodejs see [here](https://node-postgres.com/)

## Contribute
Feel free to help this library, I'm quite busy with also another Nestjs packages, but the community will appreciate the effort of improving this library. Make sure you follow the guidelines

## Stay in touch

- Author - [Tony133](https://github.com/Tony133)
- Framework - [https://nestjs.com](https://nestjs.com/)

## License

 [MIT licensed](LICENSE)
