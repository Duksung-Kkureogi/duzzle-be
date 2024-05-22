import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { SeasonEntity } from './season.entity';
import { ZoneEntity } from './zone.entity';

export class Point {
  x: number;
  y: number;
}

@Entity('puzzle_piece')
export class PuzzlePieceEntity extends BaseEntity {
  @Column('int', { primary: true })
  seasonId: number;

  @Column('int', { primary: true })
  zoneId: number;

  @Column('int', { primary: true })
  id: number;

  @Column({ type: 'jsonb', array: true })
  points: Point[];

  @Column('boolean', { default: false })
  minted: boolean;

  @ManyToOne(() => SeasonEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'season_id' })
  season: SeasonEntity;

  @ManyToOne(() => ZoneEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;
}
