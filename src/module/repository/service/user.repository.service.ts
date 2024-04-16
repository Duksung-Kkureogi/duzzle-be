import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InsertUserDto, UpdateUserDto } from '../dto/user.dto';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';
import { PostgresqlErrorCodes } from 'src/constant/postgresql-error-codes';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: number): Promise<UserEntity> { 
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ServiceError(ExceptionCode.NotFound);
    }

    return user;
  }

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

  async updateUser(dto: UpdateUserDto): Promise<void> {
    try {
      await this.userRepository.update(dto.id, dto);
    } catch (error) {
      switch (error.code) {
        case PostgresqlErrorCodes.UniqueViolation:
          throw new ServiceError(
            ExceptionCode.AlreadyExists,
            Error('동일한 이름의 유저 존재'),
          );
        default:
          throw new ServiceError(ExceptionCode.InternalServerError, error);
      }
    }
  }
}
