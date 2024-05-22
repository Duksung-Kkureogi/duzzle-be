import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('season')
export class SeasonEntity extends BaseEntity {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar')
  title: string;

  @Column('int')
  totalPieces: number;
}
