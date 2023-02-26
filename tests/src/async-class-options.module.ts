import { Module } from '@nestjs/common';
import {
  PostgresOptionsFactory,
  PostgresModuleOptions,
  PostgresModule,
} from '../../lib';
import { UsersModule } from './apps/app-postgres/app/users/users.module';

class ConfigService implements PostgresOptionsFactory {
  createPostgresOptions(): PostgresModuleOptions {
    return {
      connectionString: 'postgresql://postgres:pass123@localhost:5433/test',
    };
  }
}

@Module({
  imports: [
    PostgresModule.forRootAsync({
      useClass: ConfigService,
    }),
    PostgresModule.forRoot({
      connectionString: 'postgresql://postgres:pass123@localhost:5433/test',
    }),
    UsersModule,
  ],
})
export class AsyncOptionsClassModule {}
