import { DynamicModule, Module } from '@nestjs/common';
import { PostgresModule } from '../../lib';

@Module({})
export class DatabaseModule {
  static async forRoot(): Promise<DynamicModule> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      module: DatabaseModule,
      imports: [
        PostgresModule.forRoot(
          {
            name: 'db1Connection',
            connectionString:
              'postgresql://postgres:pass123@localhost:5433/test',
          },
          'db1Connection',
        ),
        PostgresModule.forRoot(
          {
            name: 'db2Connection',
            connectionString:
              'postgresql://postgres:pass123@localhost:5433/test',
          },
          'db2Connection',
        ),
      ],
    };
  }
}
