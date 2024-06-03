import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoryEntity } from './story.entity';
import { StoryDto } from '../dto/story.dto';

@Entity('story_content')
export class StoryContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  storyId: number;

  @Column('int')
  page: number;

  @Column('json')
  content: StoryDto[];

  @ManyToOne(() => StoryEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;
}
