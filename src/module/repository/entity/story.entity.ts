import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ZoneEntity } from './zone.entity';

@Entity('story')
export class StoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  zoneId: number;

  @Column('int')
  totalPage: number;

  @ManyToOne(() => ZoneEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;
}
