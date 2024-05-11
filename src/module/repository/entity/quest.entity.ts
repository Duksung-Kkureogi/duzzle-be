import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { QuestType } from '../enum/quest.enum';
  
  @Entity('quest')
  export class QuestEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column('enum', { enum: QuestType })
    type: QuestType;
  
    @Column('varchar')
    quest: string;

    @Column('varchar')
    answer: string;

    @Column('int')
    timeLimit: number; // 초 단위
  
    @CreateDateColumn({ nullable: true, type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
    updatedAt: Date;
  }
  
  