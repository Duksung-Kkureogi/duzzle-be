import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import {
  InsertUserDto,
  InsertUserStoryDto,
  UpdateUserDto,
  UpdateUserStoryDto,
} from '../dto/user.dto';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';
import { PostgresqlErrorCodes } from 'src/constant/postgresql-error-codes';
import { UserStoryEntity } from '../entity/user-story.entity';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(UserStoryEntity)
    private userStoryRepository: Repository<UserStoryEntity>,
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

  async findUserStoryBySeason(
    userId: number,
    seasonId: number,
  ): Promise<UserStoryEntity> {
    const userStory = await this.userStoryRepository.findOneBy({
      userId,
      seasonId,
    });

    return userStory;
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

  async insertUserStory(dto: InsertUserStoryDto): Promise<void> {
    await this.userStoryRepository.insert(dto);
  }

  async updateUserStory(dto: UpdateUserStoryDto): Promise<void> {
    await this.userStoryRepository.update(dto.id, dto);
  }

  // TODO: 개발용 메서드(관리자 페이지 작업시 삭제 예정)
  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();

    return users;
  }
}
