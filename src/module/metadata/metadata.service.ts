import { Injectable } from '@nestjs/common';
import {
  GetMetadataRequest,
  OpenseaStandardMetadata,
} from './dto/metadata.dto';
import { NftMetadataRepositoryService } from './../repository/service/nft-metadata.repository.service';

@Injectable()
export class MetadataService {
  constructor(
    private readonly nftMetadataRepositoryService: NftMetadataRepositoryService,
  ) {}

  async getMetadata(
    dto: GetMetadataRequest,
  ): Promise<OpenseaStandardMetadata | null> {
    const metadata =
      await this.nftMetadataRepositoryService.findMetadataByTokenId(
        dto.nftId,
        dto.tokenId,
      );
    return metadata;
  }
}
