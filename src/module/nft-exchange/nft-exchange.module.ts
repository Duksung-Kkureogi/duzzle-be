import { Module } from '@nestjs/common';
import { NftExchangeController } from './nft-exchange.controller';
import { NftExchangeService } from './nft-exchange.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [NftExchangeService],
  controllers: [NftExchangeController],
})
export class NftExchangeModule {}
