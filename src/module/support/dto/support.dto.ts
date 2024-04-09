import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';
import { FaqEntity } from 'src/module/repository/entity/faq.entity';

export class FaqResponse {
  @ApiProperty()
  @Expose()
  question: string;

  @ApiProperty()
  @Expose()
  answer: string;

  static from(entity: FaqEntity) {
    return plainToInstance(this, entity, { excludeExtraneousValues: true });
  }
}

export enum QuestionCategory {
  Account = 'ACCOUNT',
  Market = 'MARKET',
  Quest = 'QUEST',
  Story = 'STORY',
  Etc = 'ETC',
}
export class PostQuestionRequest {
  @ApiProperty({ type: 'enum', enum: QuestionCategory })
  @IsEnum(QuestionCategory)
  category: QuestionCategory;

  @ApiProperty({ description: '답변 받을 이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '질문 내용 최대 500자' })
  @IsString()
  @MaxLength(500)
  question: string;
}
