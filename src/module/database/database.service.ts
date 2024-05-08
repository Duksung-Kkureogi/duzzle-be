import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ConfigService } from '../config/config.service';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: ConfigService.getConfig().DB_INFO.host,
      port: ConfigService.getConfig().DB_INFO.port,
      username: ConfigService.getConfig().DB_INFO.user,
      password: ConfigService.getConfig().DB_INFO.password,
      database: ConfigService.getConfig().DB_INFO.database,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: ConfigService.getConfig().USE_SYNCHRONIZE,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
      useUTC: true,
    };
  }
}
