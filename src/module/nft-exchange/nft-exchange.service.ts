import { Injectable } from '@nestjs/common';
import { NftExchangeRepositoryService } from '../repository/service/nft-exchange.repository.service';
import { AvailableNftResponse } from './dto/available-nfts.dto';
import { PaginatedList } from 'src/dto/response.dto';

@Injectable()
export class NftExchangeService {
  constructor(
    private readonly nftExchangeRepositoryService: NftExchangeRepositoryService,
  ) {}

  async getAvailableNFTsToOffer(
    userId: number,
    userWallet: string,
  ): Promise<AvailableNftResponse> {
    return this.nftExchangeRepositoryService.getAvailableNFTsToOffer(
      userId,
      userWallet,
    );
  }

  async getAvailableNFTsToRequest(): Promise<
    PaginatedList<AvailableNftResponse>
  > {
    return this.nftExchangeRepositoryService.getAvailableNFTsToRequestPaginated();
  }
}
