import { Injectable } from '@nestjs/common';

import { UserRepositoryService } from '../repository/service/user.repository.service';
import {
  UpdateUserStoryProgressRequest,
  UserInfoResponse,
  UserStoryProgressResponse,
} from './dto/user.dto';
import { UserEntity } from '../repository/entity/user.entity';
import { uuid } from 'uuidv4';
import { CloudStorageService } from '../cloudStorage/cloudStorage.service';
import { CacheService } from './../cache/cache.service';
import { EditUserNameKey } from '../cache/dto/cache.dto';
import { RedisTTL } from '../cache/enum/cache.enum';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly zoneRepositoryService: ZoneRepositoryService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly cacheService: CacheService,
  ) {}

  async getUserInfo(userId: number): Promise<UserInfoResponse> {
    const result = await this.userRepositoryService.getUserById(userId);

    return UserInfoResponse.from(result);
  }

  async getUserStoryProgress(
    userId: number,
    seasonId: number,
  ): Promise<UserStoryProgressResponse> {
    await this.initUserStoryProgress(userId, seasonId);

    const result = await this.userRepositoryService.findUserStoryBySeason(
      userId,
      seasonId,
    );

    return UserStoryProgressResponse.from(result);
  }

  async updateUserName(
    userId: number,
    name: string,
  ): Promise<UserInfoResponse> {
    await this.userRepositoryService.updateUser({ id: userId, name });
    const result = await this.userRepositoryService.getUserById(userId);

    // 이름 변경 시간 제한 설정
    await this.cacheService.set(
      EditUserNameKey.get(userId),
      name,
      RedisTTL.EditUserName,
    );

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

    await this.userRepositoryService.updateUser({
      id: userId,
      image: imageUrl,
    });

    const result = await this.userRepositoryService.getUserById(userId);

    return UserInfoResponse.from(result);
  }

  async updateUserStoryProgress(
    userId: number,
    params: UpdateUserStoryProgressRequest,
  ): Promise<UserStoryProgressResponse> {
    const { seasonId, zoneId, page } = params;

    const currentProgress =
      await this.userRepositoryService.findUserStoryBySeason(userId, seasonId);
    const updatedProgress = currentProgress.storyProgress;
    updatedProgress.find((e) => e.zoneId === zoneId).page = page;

    await this.userRepositoryService.updateUserStory({
      id: currentProgress.id,
      storyProgress: updatedProgress,
    });

    return UserStoryProgressResponse.from({
      ...currentProgress,
      storyProgress: updatedProgress,
    });
  }

  async canEditName(userId: number): Promise<boolean> {
    const value = await this.cacheService.find(EditUserNameKey.get(userId));

    return !!!value;
  }

  async initUserStoryProgress(userId: number, seasonId: number): Promise<void> {
    const userStory = await this.userRepositoryService.findUserStoryBySeason(
      userId,
      seasonId,
    );
    let storyProgress = userStory ? userStory.storyProgress : [];

    const zoneIds = (await this.zoneRepositoryService.getZones()).map(
      (zone) => zone.id,
    );
    for (const id of zoneIds) {
      if (!storyProgress.some((e) => e.zoneId === id)) {
        storyProgress.push({ zoneId: id, page: 0 });
      }
    }

    if (userStory) {
      this.userRepositoryService.updateUserStory({
        id: userStory.id,
        storyProgress,
      });
    } else {
      this.userRepositoryService.insertUserStory({
        seasonId,
        userId,
        storyProgress,
      });
    }
  }
}
