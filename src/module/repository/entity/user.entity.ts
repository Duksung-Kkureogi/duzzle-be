import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LoginType } from '../enum/user.enum';
import { BaseEntity } from './base.entity';

export enum UserStatus {
  NORMAL = 'normal',
  BLOCK = 'block',
  DELETE = 'delete',
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('enum', { enum: LoginType })
  loginType: LoginType;

  @Column('varchar', { length: 44, unique: true })
  walletAddress: string;

  @Column('varchar', { length: 100, nullable: true })
  email: string;

  @Column('varchar', { length: 40, nullable: true, unique: true })
  name: string;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('enum', {
    enum: UserStatus,
    enumName: 'type_user_status',
    default: UserStatus.NORMAL,
  })
  status: UserStatus;
}
