import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { NftContractEntity } from './nft-contract.entity';

@Entity('item')
export class ItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  nftContractId: number;

  @Column('varchar')
  imageUrl: string;

  @Column('int')
  maxSupply: number;

  @ManyToOne(() => NftContractEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'nft_contract_id' })
  nftContract: NftContractEntity;
}
