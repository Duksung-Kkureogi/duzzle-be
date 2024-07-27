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
        storyId: entity.story.id,
        currentPage: entity.page,
        totalPage: entity.story.contents.length,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

export class StoryProgressResponse {
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
  totalStory: number;

  @ApiProperty()
  @Expose()
  readStory: number;
}

export class StoryProgressByZoneResponse {
  @ApiProperty()
  @Expose()
  storyId: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  totalPage: number;

  @ApiProperty()
  @Expose()
  readPage: number;
}

export class UpdateStoryProgressRequest {
  @ApiProperty()
  @IsNotEmpty()
  storyId: number;

  @ApiProperty()
  @IsNotEmpty()
  readPage: number;
}
