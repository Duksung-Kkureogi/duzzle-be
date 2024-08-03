import { Inject, Injectable } from '@nestjs/common';

import { UserRepositoryService } from '../repository/service/user.repository.service';
import { UserInfoResponse, UserProfileResponse } from './dto/user.dto';
import { UserEntity } from '../repository/entity/user.entity';
import { uuid } from 'uuidv4';
import { CloudStorageService } from '../cloudStorage/cloudStorage.service';
import { CacheService } from './../cache/cache.service';
import { EditUserNameKey } from '../cache/dto/cache.dto';
import { RedisTTL } from '../cache/enum/cache.enum';
import { ItemService } from '../item/item.service';
import { PuzzleService } from '../puzzle/puzzle.service';
import { USER_PROFILE_DEFAULT_IMG } from 'src/constant/image';
import { ProfileType } from '../repository/enum/user.enum';
import { LoginRequired } from 'src/types/error/application-exceptions/401-unautorized';
import { ProfileAccessDenied } from 'src/types/error/application-exceptions/403-forbidden';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly cacheService: CacheService,

    @Inject(ItemService)
    private readonly itemService: ItemService,

    @Inject(PuzzleService)
    private readonly puzzleService: PuzzleService,
  ) {}

  async getUserInfo(userId: number): Promise<UserProfileResponse> {
    const [profile, totalItems, totalPieces] = await Promise.all([
      this.userRepositoryService.getUserById(userId),
      this.itemService.getUserItemTotals(userId),
      this.puzzleService.getTotalPiecesByUser(userId),
    ]);

    const result: UserProfileResponse = {
      ...UserInfoResponse.from(profile),
      totalItems,
      totalPieces,
    };

    return result;
  }

  async getOtherUserInfo(
    userId: number | undefined,
    walletAddress: string,
  ): Promise<UserProfileResponse> {
    const profile =
      await this.userRepositoryService.getUserByWalletAddress(walletAddress);

    if (profile.profileType === ProfileType.None)
      throw new ProfileAccessDenied();
    if (profile.profileType === ProfileType.Private && userId === undefined)
      throw new LoginRequired(`Profile:${profile.profileType}`);

    const [totalItems, totalPieces] = await Promise.all([
      this.itemService.getUserItemTotals(profile.id),
      this.puzzleService.getTotalPiecesByUser(profile.id),
    ]);

    const result: UserProfileResponse = {
      ...UserInfoResponse.from(profile),
      totalItems,
      totalPieces,
    };

    return result;
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
    let imageUrl = USER_PROFILE_DEFAULT_IMG;

    if (file) {
      const imageName = uuid();
      const ext = file.originalname.split('.').pop();
      imageUrl = await this.cloudStorageService.uploadFile(
        `user/${imageName}.${ext}`,
        file,
        ext,
      );
    }

    const user = await this.userRepositoryService.getUserById(userId);
    if (user.image && user.image !== USER_PROFILE_DEFAULT_IMG) {
      await this.cloudStorageService.deleteFile(
        `user/${user.image.split('/').pop()}`,
      );
    }

    await this.userRepositoryService.updateUser({
      id: userId,
      image: imageUrl,
    });

    const result = await this.userRepositoryService.getUserById(userId);

    return UserInfoResponse.from(result);
  }

  async updateUserProfileType(
    userId: number,
    profileType: ProfileType,
  ): Promise<UserInfoResponse> {
    await this.userRepositoryService.updateUser({
      id: userId,
      profileType,
    });

    const result = await this.userRepositoryService.getUserById(userId);

    return UserInfoResponse.from(result);
  }

  async canEditName(userId: number): Promise<boolean> {
    const value = await this.cacheService.find(EditUserNameKey.get(userId));

    return !!!value;
  }
}
