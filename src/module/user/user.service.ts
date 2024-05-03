import { Injectable } from '@nestjs/common';

import { UserRepositoryService } from '../repository/service/user.repository.service';
import { UserInfoResponse } from './dto/user.dto';
import { UserEntity } from '../repository/entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepositoryService: UserRepositoryService) {}

  async getUserInfo(userId: number): Promise<UserInfoResponse> {
    const result = await this.userRepositoryService.getUserById(userId);

    return UserInfoResponse.from(result);
  }

  async updateUserName(
    userId: number,
    name: string,
  ): Promise<UserInfoResponse> {
    await this.userRepositoryService.updateUser({ id: userId, name });
    const result = await this.userRepositoryService.getUserById(userId);

    return UserInfoResponse.from(result);
  }

  // TOOD: 개발용(관리자 페이지 생성시 삭제 예정)
  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepositoryService.getUsers();

    return users;
  }
}
