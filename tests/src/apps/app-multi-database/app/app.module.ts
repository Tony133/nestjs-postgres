import { Module } from '@nestjs/common';
import { PostgresModule } from '../../../../../lib';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PostgresModule.forRoot(
      {
        connectionString: 'postgresql://postgres:pass123@localhost:5432/test1',
      },
      'db1Connection',
    ),
    PostgresModule.forRoot(
      {
        connectionString: 'postgresql://postgres:pass123@localhost:5433/test2',
      },
      'db2Connection',
    ),
    UsersModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
