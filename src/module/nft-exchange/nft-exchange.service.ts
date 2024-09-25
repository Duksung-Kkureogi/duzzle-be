import { Injectable } from '@nestjs/common';
import { NftExchangeRepositoryService } from '../repository/service/nft-exchange.repository.service';
import { AvailableNftToOfferResponse } from './dto/available-nfts-to-offer.dto';

@Injectable()
export class NftExchangeService {
  constructor(
    private readonly nftExchangeRepositoryService: NftExchangeRepositoryService,
  ) {}

  async getAvailableNFTsToOffer(
    userId: number,
    userWallet: string,
  ): Promise<AvailableNftToOfferResponse> {
    return this.nftExchangeRepositoryService.getAvailableNFTsToOffer(
      userId,
      userWallet,
    );
  }
}
