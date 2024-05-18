import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { BlockchainService } from './blockchain.service';

@Module({
  imports: [RepositoryModule],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
