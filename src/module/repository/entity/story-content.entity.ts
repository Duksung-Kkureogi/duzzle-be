import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoryEntity } from './story.entity';
import { StoryDto } from '../dto/story.dto';

@Entity('story_content')
export class StoryContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  page: number;

  @Column('json')
  content: StoryDto[];

  @ManyToOne(() => StoryEntity, (story) => story.contents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  story: StoryEntity;
}
