import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { SeasonEntity } from './season.entity';
import { ZoneEntity } from './zone.entity';
import { StoryDto } from '../dto/story.dto';

@Entity('story')
export class StoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonId: number;

  @Column('int')
  zoneId: number;

  @Column('int')
  page: number;

  @Column('json')
  story: StoryDto[];

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
