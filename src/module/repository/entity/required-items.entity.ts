import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ItemEntity } from './item.entity';
import { SeasonZoneEntity } from './season-zone.entity';

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
