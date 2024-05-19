import { Injectable } from '@nestjs/common';

import { UserRepositoryService } from '../repository/service/user.repository.service';
import { UserInfoResponse } from './dto/user.dto';
import { UserEntity } from '../repository/entity/user.entity';
import { uuid } from 'uuidv4';
import { CloudStorageService } from '../cloudStorage/cloudStorage.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

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

  async updateUserImage(
    userId: number,
    file: Express.Multer.File,
  ): Promise<UserInfoResponse> {
    let imageUrl =
      'https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/default.png';

    if (file) {
      const imageName = uuid();
      const ext = file.originalname.split('.').pop();
      imageUrl = await this.cloudStorageService.uploadFile(
        `${imageName}.${ext}`,
        file,
        ext,
      );
    }

    const user = await this.userRepositoryService.getUserById(userId);
    if (
      user.image &&
      user.image !==
        'https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/default.png'
    ) {
      await this.cloudStorageService.deleteFile(user.image.split('/').pop());
    }

    await this.userRepositoryService.updateUserImage({
      id: userId,
      image: imageUrl,
    });

    const result = await this.userRepositoryService.getUserById(userId);

    return UserInfoResponse.from(result);
  }
}
