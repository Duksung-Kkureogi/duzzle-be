import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('faq')
export class FaqEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  question: string;

  @Column('varchar')
  answer: string;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  updatedAt: Date;
}
