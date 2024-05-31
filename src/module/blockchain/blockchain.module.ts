import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { BlockchainCoreService } from './blockchain.core.service';
import { BlockchainTransactionService } from './blockchain.transaction.service';

@Module({
  imports: [RepositoryModule],
  providers: [BlockchainCoreService, BlockchainTransactionService],
  exports: [BlockchainCoreService, BlockchainTransactionService],
})
export class BlockchainModule {}
