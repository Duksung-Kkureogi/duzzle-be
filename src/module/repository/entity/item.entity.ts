import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { NftContractEntity } from './nft-contract.entity';
import { ZoneDataEntity } from './zone-data.entity';

@Entity('item')
export class ItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  nftContractId: number;

  @Column('int')
  maxSupply: number;

  @ManyToOne(() => NftContractEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'nft_contract_id' })
  nftContract: NftContractEntity;

  @ManyToOne(() => ZoneDataEntity, (zoneData) => zoneData.items)
  zoneData: ZoneDataEntity;
}
