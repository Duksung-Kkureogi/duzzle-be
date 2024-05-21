import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('zone')
export class ZoneEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column('varchar')
  nameKr: string;

  @Column('varchar')
  nameUs: string;
}
