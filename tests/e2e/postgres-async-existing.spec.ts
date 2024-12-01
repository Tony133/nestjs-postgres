import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AsyncOptionsExistingModule } from '../src/async-existing-options.module';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('Postgres (async configuration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AsyncOptionsExistingModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it(`should return created entity`, () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .expect(({ body }) => {
        expect(body[0]).toEqual({
          id: body[0].id,
          firstname: 'firstName',
          lastname: 'lastName',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
