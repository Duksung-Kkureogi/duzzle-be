import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlockchainNetworks } from '../enum/nft.enum';

@Entity('nft_contract')
export class NftContractEntity {
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
