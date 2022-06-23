import { Module } from '@nestjs/common';
import { PostgresModule } from '../../../lib';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PostgresModule.forRoot({
      host: 'localhost',
      database: 'nest',
      password: 'pass123',
      user: 'postgres',
      port: 5434,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
