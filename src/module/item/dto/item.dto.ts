import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Item {
  @ApiProperty({ description: '아이템 이름' })
  name: string;

  @ApiProperty({ description: '아이템 개수' })
  count: number;

  @ApiProperty({ description: '아이템 이미지 url' })
  image: string;

  @ApiProperty({
    description: '구역명 (설계도면의 경우에만 해당)',
    nullable: true,
  })
  zone?: string | null;

  @ApiProperty({
    description: '시즌명 (설계도면의 경우에만 해당)',
    nullable: true,
  })
  season?: string | null;
}

export class MyItemsResponse {
  @ApiProperty({ description: '총 보유 아이템 개수' })
  totalItems: number;

  @ApiProperty({ type: Item, isArray: true, description: '보유 아이템 목록' })
  @Type(() => Item)
  items: Item[];
}
