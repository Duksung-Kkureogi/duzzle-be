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
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { InternalServerErrorFilter } from 'src/filter/internal-server-exception.filter';
import { ValidationExceptionFilter } from 'src/filter/parameter-validator-exception.filter';
import { NotFoundExceptionFilter } from 'src/filter/not-found-exception.filter';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { MailModule } from './email/email.module';
import { QuestModule } from './quest/quest.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { ZoneModule } from './zone/zone.module';
import { CloudStorageModule } from './cloudStorage/cloudStorage.module';
import { MetadataModule } from './metadata/metadata.module';

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
    UserModule,
    MailModule,
    QuestModule,
    BlockchainModule
    ZoneModule,
    CloudStorageModule,
    MetadataModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: InternalServerErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class MainModule {}
