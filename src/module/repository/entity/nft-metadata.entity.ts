import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';
import { BaseEntity } from './base.entity';
import { ContractEntity } from './contract.entity';

@Entity('nft_metadata')
export class NftMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  contractId: number;

  @Column('int')
  tokenId: number;

  @Column('jsonb', { nullable: true })
  metadata: OpenseaStandardMetadata;

  @ManyToOne(() => ContractEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
