import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ContractEntity } from './contract.entity';

@Entity('item')
export class ItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  contractId: number;

  @Column('varchar')
  imageUrl: string;

  @Column('int')
  maxSupply: number;

  @ManyToOne(() => ContractEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
