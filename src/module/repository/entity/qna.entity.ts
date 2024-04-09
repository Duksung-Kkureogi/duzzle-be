import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

// TODO: 추후에 컬럼 추가
// - 답변한 관리자: answered_by
// - 답변 일시: answered_at
@Entity('qna')
export class QnaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  userId: number;

  @Column('varchar')
  question: string;

  @Column('varchar', { nullable: true })
  answer?: string;

  // 답변 받을 이메일 주소
  @Column('varchar')
  email: string;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
