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

@Entity('season_zone')
export class SeasonZoneEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonId: number;

  @Column('int')
  zoneId: number;

  @Column('int')
  pieceCountOfZone: number;

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

@Entity('required_items')
export class RequiredItemsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonZoneId: number;

  @Column('int')
  itemId: number;

  @Column('int')
  itemAmount: number;

  @ManyToOne(() => SeasonZoneEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'season_zone_id' })
  seasonZone: SeasonZoneEntity;

  @ManyToOne(() => ItemEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'item_id' })
  item: ItemEntity;
}
