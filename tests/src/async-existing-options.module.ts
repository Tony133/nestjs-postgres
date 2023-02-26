import { Module } from '@nestjs/common';
import { UsersModule } from '../src/apps/app-postgres/app/users/users.module';
import {
  PostgresModule,
  PostgresModuleOptions,
  PostgresOptionsFactory,
} from '../../lib';

class ConfigService implements PostgresOptionsFactory {
  createPostgresOptions(): PostgresModuleOptions {
    return {
      connectionString: 'postgresql://postgres:pass123@localhost:5433/test',
    };
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}

@Module({
  imports: [
    PostgresModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    PostgresModule.forRoot({
      connectionString: 'postgresql://postgres:pass123@localhost:5433/test',
    }),
    UsersModule,
  ],
})
export class AsyncOptionsExistingModule {}
