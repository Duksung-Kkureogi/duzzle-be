import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { HealthController } from './health/health.controller';
import { RepositoryModule } from './repository/repository.module';
import { DatabaseConfigModule } from './database/database.module';
import { DatabaseConfigService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from './config/config.service';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useClass: DatabaseConfigService,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource({
          dataSource: new DataSource(options),
        });
      },
    }),
    {
      ...JwtModule.register({ secret: ConfigService.getConfig().JWT_SECRET }),
      global: true,
    },
    RepositoryModule,
    AuthModule,
    SupportModule,
  ],
  controllers: [HealthController],
})
export class MainModule {}
