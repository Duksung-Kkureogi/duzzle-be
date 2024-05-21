import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NftContractEntity } from './nft-contract.entity';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';
import { BaseEntity } from './base.entity';

@Entity('nft_metadata')
export class NftMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  nftContractId: number;

  @Column('int')
  tokenId: number;

  @Column('jsonb', { nullable: true })
  metadata: OpenseaStandardMetadata;

  @ManyToOne(() => NftContractEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'nft_contract_id' })
  nft: NftContractEntity;
}
