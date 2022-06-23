import { DynamicModule, Module } from '@nestjs/common';
import { PostgresCoreModule } from './postgres-core.module';
import {
  PostgresModuleAsyncOptions,
  PostgresModuleOptions,
} from './interfaces';

@Module({})
export class PostgresModule {
  public static forRoot(
    options: PostgresModuleOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: PostgresModule,
      imports: [PostgresCoreModule.forRoot(options, connection)],
    };
  }

  public static forRootAsync(
    options: PostgresModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: PostgresModule,
      imports: [PostgresCoreModule.forRootAsync(options, connection)],
    };
  }
}
