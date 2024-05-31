import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { BlockchainCoreService } from './blockchain.core.service';
import { BlockchainTransactionService } from './blockchain.transaction.service';
import { HttpClientModule } from '../http-client/http-client.module';

@Module({
  imports: [RepositoryModule, HttpClientModule],
  providers: [BlockchainCoreService, BlockchainTransactionService],
  exports: [BlockchainCoreService, BlockchainTransactionService],
})
export class BlockchainModule {}
