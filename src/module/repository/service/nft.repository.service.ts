import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NftMetadataEntity } from '../entity/nft-metadata.entity';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';
import { ContractEntity } from '../entity/contract.entity';

@Injectable()
export class NftRepositoryService {
  constructor(
    @InjectRepository(NftMetadataEntity)
    private nftMetadataRepository: Repository<NftMetadataEntity>,

    @InjectRepository(ContractEntity)
    private nftContractRepository: Repository<ContractEntity>,
  ) {}

  async findNftContractById(id: number): Promise<ContractEntity | null> {
    const contract = await this.nftContractRepository.findOneBy({ id });

    return contract;
  }

  async findMetadataByTokenId(
    contractId: number,
    tokenId: number,
  ): Promise<OpenseaStandardMetadata> {
    const nftMetadata = await this.nftMetadataRepository.findOneBy({
      contractId,
      tokenId,
    });

    return nftMetadata?.metadata;
  }

  async findMetadataByContractId(
    contractId: number,
  ): Promise<OpenseaStandardMetadata> {
    const nftMetadata = await this.nftMetadataRepository.findOneBy({
      contractId,
    });

    return nftMetadata?.metadata;
  }
}
