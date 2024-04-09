import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InsertUserDto } from '../dto/user.dto';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async findUserByWalletAddress(walletAddress: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ walletAddress });

    return user;
  }

  async insertUser(dto: InsertUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(dto);
    await this.userRepository.insert(user);

    return user;
  }

  async saveUser(dto: any): Promise<UserEntity> {
    const user = await this.userRepository.save(dto);

    return user;
  }
}
