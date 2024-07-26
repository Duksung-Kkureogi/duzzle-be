import { RepositoryModule } from 'src/module/repository/repository.module';
import { Module } from '@nestjs/common';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { QuestForGuestController } from './quest-for-guest.controller';

@Module({
  imports: [RepositoryModule, BlockchainModule],
  controllers: [QuestController, QuestForGuestController],
  providers: [QuestService],
  exports: [QuestService],
})
export class QuestModule {}
