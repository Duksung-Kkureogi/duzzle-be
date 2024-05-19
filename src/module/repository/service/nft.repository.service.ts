import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NftMetadataEntity } from '../entity/nft-metadata.entity';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';
import { NftContractEntity } from '../entity/nft-contract.entity';

@Injectable()
export class NftRepositoryService {
  constructor(
    @InjectRepository(NftMetadataEntity)
    private nftMetadataRepository: Repository<NftMetadataEntity>,

    @InjectRepository(NftContractEntity)
    private nftContractRepository: Repository<NftContractEntity>,
  ) {}

  async findNftContractById(id: number): Promise<NftContractEntity | null> {
    const contract = await this.nftContractRepository.findOneBy({ id });

    return contract;
  }

  async findMetadataByTokenId(
    nftContractId: number,
    tokenId: number,
  ): Promise<OpenseaStandardMetadata> {
    const nftMetadata = await this.nftMetadataRepository.findOneBy({
      nftContractId,
      tokenId,
    });

    return nftMetadata?.metadata;
  }

  async findMetadataByContractId(
    nftContractId: number,
  ): Promise<OpenseaStandardMetadata> {
    const nftMetadata = await this.nftMetadataRepository.findOneBy({
      nftContractId,
    });

    return nftMetadata?.metadata;
  }
}
