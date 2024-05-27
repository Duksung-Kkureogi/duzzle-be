import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StoryDto {
  id: number;
  speaker: string;
  content: string;
  image?: string;
}

export class UserStoryProgressDto {
  @ApiProperty()
  @IsNotEmpty()
  seasonId: number;

  @ApiProperty()
  @IsNotEmpty()
  data: ZoneStoryProgressDto[];
}

export class ZoneStoryProgressDto {
  @ApiProperty()
  @IsNotEmpty()
  zoneId: number;

  @ApiProperty()
  @IsNotEmpty()
  progress: number;
}
