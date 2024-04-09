import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
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
