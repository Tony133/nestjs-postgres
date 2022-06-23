import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { PostgresModuleOptions } from './postgres-options.interface';
import { PostgresOptionsFactory } from './postgres-options-factory.interface';

export interface PostgresModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  inject?: any[];
  useClass?: Type<PostgresOptionsFactory>;
  useExisting?: Type<PostgresOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PostgresModuleOptions> | PostgresModuleOptions;
}
