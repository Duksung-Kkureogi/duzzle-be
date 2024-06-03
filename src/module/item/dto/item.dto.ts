import { UserBlueprintItemsDto } from './../../repository/dto/item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import {
  BLUEPRINT_ITEM_IMAGE_URL,
  BLUEPRINT_ITEM_NAME,
} from 'src/constant/item';

export class Item {
  @ApiProperty({ description: '아이템 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '아이템 개수' })
  @Expose()
  @Type(() => Number)
  count: number;

  @ApiProperty({ description: '아이템 이미지 url' })
  @Expose()
  image: string;

  @ApiProperty({
    description: '구역명 (설계도면의 경우에만 해당)',
    nullable: true,
  })
  @Expose()
  zone?: string | null;

  @ApiProperty({
    description: '시즌명 (설계도면의 경우에만 해당)',
    nullable: true,
  })
  @Expose()
  season?: string | null;

  static from(dto: UserBlueprintItemsDto | Item) {
    const item = dto.zone
      ? {
          ...dto,
          image: BLUEPRINT_ITEM_IMAGE_URL,
          name: BLUEPRINT_ITEM_NAME,
        }
      : dto;

    return plainToInstance(this, item);
  }
}

export class MyItemsResponse {
  @ApiProperty({ description: '총 보유 아이템 개수' })
  totalItems: number;

  @ApiProperty({ type: Item, isArray: true, description: '보유 아이템 목록' })
  @Type(() => Item)
  items: Item[];
}
