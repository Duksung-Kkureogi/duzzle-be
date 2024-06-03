import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { BlockchainCoreService } from './blockchain.core.service';
import { BlockchainTransactionService } from './blockchain.transaction.service';
import { HttpClientModule } from '../http-client/http-client.module';
import { BlockchainController } from './blockchain.controller';

@Module({
  imports: [RepositoryModule, HttpClientModule],
  providers: [BlockchainCoreService, BlockchainTransactionService],
  controllers: [BlockchainController],
  exports: [BlockchainCoreService, BlockchainTransactionService],
})
export class BlockchainModule {}
