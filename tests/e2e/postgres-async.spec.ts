import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AsyncApplicationModule } from '../src/app-async.module';
import * as request from 'supertest';

describe('Postgres (async configuration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncApplicationModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
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
