import { Injectable } from '@nestjs/common';
import { NftExchangeRepositoryService } from '../repository/service/nft-exchange.repository.service';
import { PaginatedList } from 'src/dto/response.dto';
import { AvailableNftsToRequestRequest } from './dto/available-nfts-to-request.dto';
import { AvailableNftDto } from './dto/available-nfts.dto';
import { PostNftExchangeRequest } from './dto/nft-exchange.dto';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ContractKey } from '../repository/enum/contract.enum';
import { NFTType } from './domain/nft-asset';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { NftExchangeOfferStatus } from '../repository/enum/nft-exchange-status.enum';
import { AccessDenied } from 'src/types/error/application-exceptions/403-forbidden';
import { ActionNotPermittedError } from 'src/types/error/application-exceptions/409-conflict';
import { NftExchangeListDto } from './dto/nft-exchange-offer.dto';

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

  async postNftExchange(
    userId: number,
    params: PostNftExchangeRequest,
  ): Promise<void> {
    const Nfts = [...params.offeredNfts, ...params.requestedNfts];
    const seasonZoneIds = (
      await this.zoneRepositoryService.getSeasonZones()
    ).map((zone) => zone.id);

    for (const nft of Nfts) {
      if (nft.type === NFTType.Material) {
        const contract = await this.nftRepositoryService.findContractById(
          nft.contractId,
        );
        if (!contract || contract.key !== ContractKey.ITEM_MATERIAL) {
          throw new ContentNotFoundError('contract', nft.contractId);
        }
      } else if (
        nft.type === NFTType.Blueprint ||
        nft.type === NFTType.PuzzlePiece
      ) {
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

  async deleteNftExchange(
    userId: number,
    nftExchangeId: number,
  ): Promise<void> {
    const nftExchange =
      await this.nftExchangeRepositoryService.findNftExchangeById(
        nftExchangeId,
      );

    if (!nftExchange) {
      throw new ContentNotFoundError('nft-exchange-offer', nftExchangeId);
    }
    if (nftExchange.offerorUserId !== userId) {
      throw new AccessDenied('nft-exchange-offer', nftExchangeId);
    }

    const allowedStatus = [
      NftExchangeOfferStatus.LISTED,
      NftExchangeOfferStatus.FAILED,
    ];
    if (!allowedStatus.includes(nftExchange.status)) {
      throw new ActionNotPermittedError(
        'cancel',
        'nft-exchange-offer',
        nftExchange.status,
      );
    }

    await this.nftExchangeRepositoryService.deleteNftExchange(nftExchangeId);
  }

  async getNftExchangeList(
    status?: string,
    requestedNfts?: string,
    offeredNfts?: string,
    offerorUser?: string,
  ): Promise<NftExchangeListDto[]> {
    return await this.nftExchangeRepositoryService.getNftExchangeList(
      status,
      requestedNfts,
      offeredNfts,
      offerorUser,
    );
  }
}
