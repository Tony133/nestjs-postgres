import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresModule } from '../../../../../lib';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PostgresModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        database: config.get<string>('POSTGRES_DB', 'test'),
        password: config.get<string>('POSTGRES_PASSWORD', 'pass123'),
        user: config.get<string>('POSTGRES_USER', 'postgres'),
        port: config.get<number>('POSTGRES_PORT', 5433),
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
