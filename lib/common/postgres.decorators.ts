import { Inject } from '@nestjs/common';
import { PostgresModuleOptions } from '../interfaces/postgres-options.interface';
import { getConnectionToken } from './postgres.utils';

export const InjectClient = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectPool = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectConnection: (
  connection?: PostgresModuleOptions | string,
) => ParameterDecorator = (connection?: PostgresModuleOptions | string) =>
  Inject(getConnectionToken(connection));
