import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NftContractEntity } from './nft-contract.entity';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';

@Entity('nft_metadata')
export class NftMetadataEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  nftContractId: number;

  @Column('int')
  tokenId: number;

  @Column('jsonb', { nullable: true })
  metadata: OpenseaStandardMetadata;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => NftContractEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'nft_contract_id' })
  nft: NftContractEntity;
}
