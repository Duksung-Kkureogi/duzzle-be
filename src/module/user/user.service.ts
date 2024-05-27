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
import { ConfigService } from '../config/config.service';
import { CacheService } from './../cache/cache.service';
import { EditUserNameKey } from '../cache/dto/cache.dto';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';
import { UserStoryProgressDto } from '../repository/dto/story.dto';

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

  async getUserStoryProgressBySeason(
    userId: number,
    seasonId: number,
  ): Promise<UserStoryProgressResponse> {
    this.initUserStory(userId, seasonId);

    const result = await this.userRepositoryService.findUserById(userId);

    return UserStoryProgressResponse.from(result, seasonId);
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
      ConfigService.getConfig().REDIS_TTL.EDIT_NAME,
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

  async updateUserStory(
    userId: number,
    params: UpdateUserStoryProgressRequest,
  ): Promise<UserStoryProgressResponse> {
    const { seasonId, zoneId, progress } = params;

    const result = await this.userRepositoryService.findUserById(userId);

    const userProgress = result.storyProgress.find(
      (e) => e.seasonId === seasonId,
    );
    const zoneProgress = userProgress.data.find((e) => e.zoneId === zoneId);
    zoneProgress.progress = progress;

    await this.userRepositoryService.updateUser(result);

    return UserStoryProgressResponse.from(result, seasonId);
  }

  async canEditName(userId: number): Promise<boolean> {
    const value = await this.cacheService.find(EditUserNameKey.get(userId));

    return !!!value;
  }

  async initUserStory(userId: number, seasonId: number): Promise<void> {
    const user = await this.userRepositoryService.findUserById(userId);

    // 0. 이번 시즌을 제외한 userProgress: UserStoryProgressDto[]
    let userProgress =
      user.storyProgress?.filter(
        (userProgress) => userProgress.seasonId !== seasonId,
      ) || [];

    // 1. user.storyProgress가 null 일 떄, seasonId가 일치하는 값이 없을 때, 기본값
    let zoneProgress = { seasonId: seasonId, data: [] };

    // 2. user.storyProgress가 있고, seasonId가 일치하는 값이 있을 때, 저장되어 있는 값
    const currentProgress = user.storyProgress?.find(
      (userProgress) => userProgress.seasonId === seasonId,
    );
    if (currentProgress) {
      zoneProgress = currentProgress;
    }

    // 3. 모든 zoneId 값에 대한 기본값 설정. 이미 값이 있는 경우 무시
    const zoneIds = (await this.zoneRepositoryService.getZones()).map(
      (zone) => zone.id,
    );

    for (const id of zoneIds) {
      if (!zoneProgress.data.some((e) => e.zoneId === id)) {
        zoneProgress.data.push({ zoneId: id, progress: 0 });
      }
    }

    // 4. userProgress에 이번 시즌 진행도 push
    userProgress.push(zoneProgress);

    // 5. userDB 업데이트
    this.userRepositoryService.updateUser({
      id: userId,
      storyProgress: userProgress,
    });
  }
}
