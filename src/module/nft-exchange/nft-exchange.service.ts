import { Injectable } from '@nestjs/common';
import { NftExchangeRepositoryService } from '../repository/service/nft-exchange.repository.service';
import { PaginatedList } from 'src/dto/response.dto';
import { AvailableNftsToRequestRequest } from './dto/available-nfts-to-request.dto';
import { AvailableNftDto } from './dto/available-nfts.dto';
import { ReportProvider } from 'src/provider/report.provider';
import { PostNftExchangeRequest } from './dto/nft-exchange.dto';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ContractKey } from '../repository/enum/contract.enum';
import { NFTType } from './dto/nft-asset';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';
import { InvalidParamsError } from 'src/types/error/application-exceptions/400-bad-request';

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
          throw new InvalidParamsError();
        }
      } else if (
        nft.type === NFTType.Blueprint ||
        nft.type === NFTType.PuzzlePiece
      ) {
        if (!seasonZoneIds.includes(nft.seasonZoneId)) {
          throw new InvalidParamsError();
        }
      }
    }

    await this.nftExchangeRepositoryService.postNftExchange({
      offerorUserId: userId,
      ...params,
    });
  }
}
