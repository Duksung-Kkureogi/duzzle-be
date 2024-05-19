import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('nft')
export class NftEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  network: string;

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
