import { PostgresModuleOptions } from './postgres-options.interface';

export interface PostgresOptionsFactory {
  createPostgresOptions(
    connectionName?: string,
  ): Promise<PostgresModuleOptions> | PostgresModuleOptions;
}
