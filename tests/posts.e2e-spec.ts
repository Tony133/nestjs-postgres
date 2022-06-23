import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from './app-multi-database/app/users/users.module';
import { PostgresModule } from '../lib';
import * as request from 'supertest';
import { PostModule } from './app-multi-database/app/post/post.module';

describe('[Feature] Posts - /posts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PostgresModule.forRootAsync(
          {
            useFactory: () => ({
              connectionString:
                'postgresql://postgres:pass123@localhost:5433/nest2',
            }),
          },
          'db2Connection',
        ),
        UsersModule,
        PostModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .send({
        title: 'title #1',
        description: 'description #1',
      })
      .then((res) => {
        res.body;
      });
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK)
      .set('Accept', 'application/json')
      .then(({ body }) => {
        expect(body['users']).toEqual([
          {
            id: 1,
            title: 'title #1',
            description: 'description #1',
          },
          {
            id: 2,
            title: 'title #1',
            description: 'description #1',
          },
          {
            id: 3,
            title: 'title #1',
            description: 'description #1',
          },
          {
            id: 4,
            title: 'title #1',
            description: 'description #1',
          },
        ]);
      });
  });

  it('Get one [GET /:id]', () => {
    return request(app.getHttpServer())
      .get('/posts/2')
      .expect(HttpStatus.OK)
      .set('Accept', 'application/json')
      .then(({ body }) => {
        expect(body['users']).toEqual([
          {
            id: 2,
            title: 'title #1',
            description: 'description #1',
          },
        ]);
      });
  });

  it('Update one [PUT /:id]', () => {
    return request(app.getHttpServer())
      .put('/posts/2')
      .expect(HttpStatus.OK)
      .send({
        title: 'title update',
        description: 'description update',
      })
      .then((res) => {
        res.body;
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/posts/1')
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
