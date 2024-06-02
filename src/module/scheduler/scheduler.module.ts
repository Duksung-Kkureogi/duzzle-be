import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RepositoryModule,
    BlockchainModule,
    CacheModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
