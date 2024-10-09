import { Injectable } from '@nestjs/common';
import { NftExchangeRepositoryService } from '../repository/service/nft-exchange.repository.service';
import { PaginatedList } from 'src/dto/response.dto';
import { AvailableNftsToRequestRequest } from './dto/available-nfts-to-request.dto';
import { AvailableNftDto } from './dto/available-nfts.dto';
import { PostNftExchangeRequest } from './dto/nft-exchange.dto';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ContractKey } from '../repository/enum/contract.enum';
import {
  BlueprintOrPuzzleNFT,
  MaterialNFT,
  NFTAsset,
  NFTType,
} from './domain/nft-asset';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';

@Injectable()
export class NftExchangeService {
  constructor(
    private readonly zoneRepositoryService: ZoneRepositoryService,

    private readonly nftRepositoryService: NftRepositoryService,

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

  private isMaterialNFT(nft: NFTAsset): nft is MaterialNFT {
    return nft.type === NFTType.Material;
  }

  private isBlueprintOrPuzzleNFT(nft: NFTAsset): nft is BlueprintOrPuzzleNFT {
    return nft.type === NFTType.Blueprint || nft.type === NFTType.PuzzlePiece;
  }

  async postNftExchange(
    userId: number,
    params: PostNftExchangeRequest,
  ): Promise<void> {
    const Nfts = [...params.offeredNfts, ...params.requestedNfts];
    const seasonZoneIds = (
      await this.zoneRepositoryService.getSeasonZones()
    ).map((zone) => zone.id);

    for (const nft of Nfts) {
      if (this.isMaterialNFT(nft)) {
        const contract = await this.nftRepositoryService.findContractById(
          nft.contractId,
        );
        if (!contract || contract.key !== ContractKey.ITEM_MATERIAL) {
          throw new ContentNotFoundError('contract', nft.contractId);
        }
      } else if (this.isBlueprintOrPuzzleNFT(nft)) {
        if (!seasonZoneIds.includes(nft.seasonZoneId)) {
          throw new ContentNotFoundError('seasonZone', nft.seasonZoneId);
        }
      }
    }

    await this.nftExchangeRepositoryService.postNftExchange({
      offerorUserId: userId,
      ...params,
    });
  }
}
