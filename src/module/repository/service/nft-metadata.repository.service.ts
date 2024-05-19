import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NftMetadataEntity } from '../entity/nft-metadata.entity';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';

@Injectable()
export class NftMetadataRepositoryService {
  constructor(
    @InjectRepository(NftMetadataEntity)
    private nftMetadataRepository: Repository<NftMetadataEntity>,
  ) {}

  async findMetadataByTokenId(
    nftId: number,
    tokenId: number,
  ): Promise<OpenseaStandardMetadata> {
    const nftMetadata = await this.nftMetadataRepository.findOneBy({
      nftId,
      tokenId,
    });

    return nftMetadata?.metadata;
  }
}
