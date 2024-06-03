import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { StoryDto } from 'src/module/repository/dto/story.dto';
import { StoryContentEntity } from 'src/module/repository/entity/story-content.entity';
import { UserStoryEntity } from 'src/module/repository/entity/user-story.entity';

export class StoryRequest {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  storyId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;
}

export class StoryResponse {
  @ApiProperty()
  @Expose()
  storyId: number;

  @ApiProperty()
  @Expose()
  zoneId: number;

  @ApiProperty()
  @Expose()
  currentPage: number;

  @ApiProperty()
  @Expose()
  totalPage: number;

  @ApiProperty()
  @Expose()
  content: StoryDto[];

  static from(entity: StoryContentEntity) {
    return plainToInstance(
      this,
      {
        ...entity,
        zoneId: entity.story.zoneId,
        currentPage: entity.page,
        totalPage: entity.story.totalPage,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

export class UserStoryProgressResponse {
  @ApiProperty()
  @Expose()
  storyId: number;

  @ApiProperty()
  @Expose()
  zoneId: number;

  @ApiProperty()
  @Expose()
  zoneNameKr: string;

  @ApiProperty()
  @Expose()
  zoneNameUs: string;

  @ApiProperty()
  @Expose()
  totalPage: number;

  @ApiProperty()
  @Expose()
  readPage: number;

  static from(entity: UserStoryEntity) {
    return plainToInstance(
      this,
      {
        ...entity,
        zoneId: entity.story.zoneId,
        zoneNameKr: entity.story.zone.nameKr,
        zoneNameUs: entity.story.zone.nameUs,
        totalPage: entity.story.totalPage,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

export class UpdateUserStoryProgressRequest {
  @ApiProperty()
  @IsNotEmpty()
  storyId: number;

  @ApiProperty()
  @IsNotEmpty()
  readPage: number;
}
