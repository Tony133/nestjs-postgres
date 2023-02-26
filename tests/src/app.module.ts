import { Module } from '@nestjs/common';
import { PostgresModule } from '../../lib';
import { UsersModule } from './apps/app-postgres/app/users/users.module';

@Module({
  imports: [
    PostgresModule.forRoot({
      connectionString: 'postgresql://postgres:pass123@localhost:5433/test',
    }),
    UsersModule,
  ],
})
export class ApplicationModule {}
