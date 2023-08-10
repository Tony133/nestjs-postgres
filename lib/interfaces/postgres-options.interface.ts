import { Client } from 'pg';

export interface PostgresModuleOptions {
  name?: string;
  clientOptions?: Client;
  host?: string;
  database?: string;
  password?: string;
  user?: string;
  port?: number;
  ssl?: boolean | PostgresSSLOptions;
  connectionString?: string;
  retryAttempts?: number;
  retryDelay?: number;
  waitForConnections?: boolean;
  types?: any;
  statementTimeout?: number;
  queryTimeout?: number;
  applicationName?: string;
  connectionTimeoutMillis?: number;
  idleInTransactionSessionTimeout?: number;
}

interface PostgresSSLOptions {
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
}
