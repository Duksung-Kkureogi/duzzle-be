import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, plainToInstance } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { StoryEntity } from 'src/module/repository/entity/story.entity';

export class StoryRequest {
  @IsInt()
  @Type(() => Number)
  seasonId: number;

  @IsInt()
  @Type(() => Number)
  zoneId: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;
}

export class StoryResponse {
  @ApiProperty({ description: '시즌 타이틀' })
  @Expose()
  season: string;

  @ApiProperty({ description: '구역 이름' })
  @Expose()
  zoneNameKr: string;

  @ApiProperty({ description: '구역 이름(영문)' })
  @Expose()
  zoneNameUs: string;

  @ApiProperty({ description: '페이지 번호' })
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  story: StoryDto[];

  static from(entity: StoryEntity) {
    return plainToInstance(
      this,
      {
        ...entity,
        season: entity.season.title,
        zoneNameKr: entity.zone.nameKr,
        zoneNameUs: entity.zone.nameUs,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

export class StoryDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  speaker: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  image?: string;
}

export class StoryProgressDto {
  @ApiProperty()
  @Expose()
  zoneId: number;

  @ApiProperty()
  @Expose()
  page: number;
}
