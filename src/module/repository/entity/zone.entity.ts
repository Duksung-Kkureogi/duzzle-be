import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('zone')
export class ZoneEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column('varchar')
  nameKr: string;

  @Column('varchar')
  nameUs: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
