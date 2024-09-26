import { Injectable } from '@nestjs/common';
import { NftExchangeRepositoryService } from '../repository/service/nft-exchange.repository.service';
import { PaginatedList } from 'src/dto/response.dto';
import { AvailableNftsToRequestRequest } from './dto/available-nfts-to-request.dto';
import { AvailableNftDto } from './dto/available-nfts.dto';

@Injectable()
export class NftExchangeService {
  constructor(
    private readonly nftExchangeRepositoryService: NftExchangeRepositoryService,
  ) {}

  async getAvailableNFTsToOffer(
    userId: number,
    userWallet: string,
  ): Promise<AvailableNftDto[]> {
    return this.nftExchangeRepositoryService.getAvailableNFTsToOffer(
      userId,
      userWallet,
    );
  }

  async getAvailableNFTsToRequest(
    params: AvailableNftsToRequestRequest,
  ): Promise<PaginatedList<AvailableNftDto>> {
    return this.nftExchangeRepositoryService.getAvailableNFTsToRequestPaginated(
      params,
    );
  }
}