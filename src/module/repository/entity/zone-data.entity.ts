import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { SeasonEntity } from './season.entity';
import { ZoneEntity } from './zone.entity';
import { ItemEntity } from './item.entity';

export class Point {
  x: number;
  y: number;
}

@Entity('zone_data')
export class ZoneDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonId: number;

  @Column('int')
  zoneId: number;

  @Column('int')
  pieceCountOfZone: number;

  @Column('jsonb')
  pointsOfZone: Point[]; // length = pieceCountOfZone

  @Column('int', { array: true })
  requiredItems: number[];

  @Column('int', { array: true })
  requiredAmouts: number[];

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

  @OneToMany(() => ItemEntity, (items) => items.zoneData)
  items: Array<ItemEntity>;
}
