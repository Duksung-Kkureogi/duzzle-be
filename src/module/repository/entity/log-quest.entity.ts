import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestEntity } from './quest.entity';

@Entity('log_quest')
export class LogQuestEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  questId: number;

  @Column('int')
  userId: number;

  @Column('boolean', { nullable: true })
  isSucceeded: boolean;

  @Column('boolean', { nullable: true })
  isCompleted: boolean;

  @UpdateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

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
