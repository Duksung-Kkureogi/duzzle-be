import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestEntity } from './quest.entity';
import { BaseEntity } from './base.entity';

@Entity('log_quest')
export class LogQuestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  questId: number;

  @Column('int')
  userId: number;

  @Column('boolean', { nullable: true })
  isSucceeded: boolean;

  @Column('boolean', { nullable: true })
  rewardReceived: boolean;

  @Column('boolean', { nullable: true })
  isCompleted: boolean;

  @ManyToOne(() => UserEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => QuestEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'quest_id' })
  quest: QuestEntity;
}
