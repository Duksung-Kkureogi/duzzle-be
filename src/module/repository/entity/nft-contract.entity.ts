import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BlockchainNetworks } from '../enum/nft.enum';
import { BaseEntity } from './base.entity';

@Entity('nft_contract')
export class NftContractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('enum', { enum: BlockchainNetworks })
  network: BlockchainNetworks;

  @Column('varchar')
  address: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  symbol: string;

  @Column('boolean')
  isTokenIdAutoIncremented: boolean;
}
