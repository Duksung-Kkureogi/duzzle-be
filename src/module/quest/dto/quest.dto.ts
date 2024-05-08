import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsArray, IsPositive, IsString } from 'class-validator';
import { QuestEntity } from 'src/module/repository/entity/quest.entity';
import { QuestType } from 'src/module/repository/enum/quest.enum';

export class StartRandomQuestResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ type: 'enum', enum: QuestType })
  @Expose()
  type: QuestType;

  @ApiProperty({ description: '제한시간, 초 단위' })
  @Expose()
  timeLimit: number;

  @ApiProperty({ description: '퀘스트 내용' })
  @Expose()
  content: string;

  static from(entity: QuestEntity) {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
    });
  }
}

export class GetResultRequest {
  @ApiProperty()
  @IsPositive()
  questId: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  answer: string[];
}
