import { HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from '../src/apps/app-postgres/app/users/users.module';
import * as request from 'supertest';
import { AppModule } from '../src/apps/app-postgres/app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('[Feature] Users - /users', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('should create a new users [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .then(({ body }) => {
        expect(body[0]).toEqual({
          id: body[0].id,
          firstname: 'firstName',
          lastname: 'lastName',
        });
      });
  });

  it('should get all users [GET /users]', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .set('Accept', 'application/json')
      .then(({ body }) => {
        expect(body).toEqual([
          {
            id: 1,
            firstname: 'firstName',
            lastname: 'lastName',
          },
        ]);
      });
  });

  it('should get a user by id [GET /users/:id]', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(HttpStatus.OK)
      .set('Accept', 'application/json')
      .then(({ body }) => {
        expect(body).toEqual([
          {
            id: 1,
            firstname: 'firstName',
            lastname: 'lastName',
          },
        ]);
      });
  });

  it('should update a user by id [PUT /users/:id]', () => {
    return request(app.getHttpServer())
      .put('/users/1')
      .expect(HttpStatus.OK)
      .send({
        firstName: 'firstName update',
        lastName: 'lastName update',
      })
      .then(({ body }) => {
        expect(body[0]).toEqual({
          id: 1,
          firstname: 'firstName update',
          lastname: 'lastName update',
        });
      });
  });

  it('should delete a user by id [DELETE /users/:id]', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
