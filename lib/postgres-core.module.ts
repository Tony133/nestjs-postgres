import {
  Global,
  Module,
  DynamicModule,
  Provider,
  Type,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import {
  PostgresModuleAsyncOptions,
  PostgresModuleOptions,
  PostgresOptionsFactory,
} from './interfaces';
import { getConnectionToken, handleRetry } from './common/postgres.utils';
import { POSTGRES_MODULE_OPTIONS } from './postgres.constants';
import { ModuleRef } from '@nestjs/core';
import { defer, lastValueFrom } from 'rxjs';
import { Client, Pool } from 'pg';

@Global()
@Module({})
export class PostgresCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(POSTGRES_MODULE_OPTIONS)
    private readonly options: PostgresModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(
    options: PostgresModuleOptions,
    connection?: string,
  ): DynamicModule {
    const knexModuleOptions = {
      provide: POSTGRES_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async () => await this.createConnectionFactory(options),
    };

    return {
      module: PostgresCoreModule,
      providers: [connectionProvider, knexModuleOptions],
      exports: [connectionProvider],
    };
  }

  public static forRootAsync(
    options: PostgresModuleAsyncOptions,
    connection: string,
  ): DynamicModule {
    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async (options: PostgresModuleOptions) => {
        return await this.createConnectionFactory(options);
      },
      inject: [POSTGRES_MODULE_OPTIONS],
    };

    return {
      module: PostgresCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), connectionProvider],
      exports: [connectionProvider],
    };
  }

  async onApplicationShutdown(): Promise<any> {
    const connection = this.moduleRef.get<Pool>(
      getConnectionToken(this.options as PostgresModuleOptions) as Type<Pool>,
    );
    connection && (await connection.end);
  }

  public static createAsyncProviders(
    options: PostgresModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<PostgresOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  public static createAsyncOptionsProvider(
    options: PostgresModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: POSTGRES_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // `as Type<PostgresOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<PostgresOptionsFactory>,
    ];

    return {
      provide: POSTGRES_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: PostgresOptionsFactory,
      ): Promise<PostgresModuleOptions> => {
        return await optionsFactory.createPostgresOptions();
      },
      inject,
    };
  }

  private static async createConnectionFactory(
    options: PostgresModuleOptions,
  ): Promise<any> {
    return lastValueFrom(
      defer(() => {
        const client = new Pool(options);
        return client.connect();
      }).pipe(handleRetry(options.retryAttempts, options.retryDelay)),
    );
  }
}
