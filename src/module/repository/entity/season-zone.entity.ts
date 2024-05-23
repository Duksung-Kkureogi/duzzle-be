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
import { RequiredItemsEntity } from './required-items.entity';

@Entity('season_zone')
export class SeasonZoneEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonId: number;

  @Column('int')
  zoneId: number;

  @Column('int')
  pieceCount: number;

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

  @OneToMany(
    () => RequiredItemsEntity,
    (requiredItems) => requiredItems.seasonZone,
  )
  requiredItems: RequiredItemsEntity[];
}
