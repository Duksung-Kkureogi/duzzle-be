import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('season')
export class SeasonEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  id: number;

  @ApiProperty()
  @Column('varchar')
  title: string;

  @ApiProperty()
  @Column('int')
  totalPieces: number;
}
