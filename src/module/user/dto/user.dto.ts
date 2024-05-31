import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserStoryEntity } from 'src/module/repository/entity/user-story.entity';
import { UserEntity } from 'src/module/repository/entity/user.entity';
import { StoryProgressDto } from 'src/module/story/dto/story.dto';

export class UserInfoResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty()
  @Expose()
  level: number;

  @ApiProperty()
  @Expose()
  walletAddress: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  static from(entity: UserEntity) {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
    });
  }
}

export class UserStoryProgressResponse {
  @ApiProperty()
  @Expose()
  seasonId: number;

  @ApiProperty()
  @Expose()
  storyProgress: StoryProgressDto[];

  static from(entity: UserStoryEntity) {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
    });
  }
}

export class UpdateUserNameRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class UpdateUserStoryProgressRequest {
  @ApiProperty()
  @IsNotEmpty()
  seasonId: number;

  @ApiProperty()
  @IsNotEmpty()
  zoneId: number;

  @ApiProperty()
  @IsNotEmpty()
  page: number;
}

export class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file: any;
}
