import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import {
  Point,
  PuzzlePieceEntity,
} from 'src/module/repository/entity/puzzle-piece.entity';
import { RequiredItemsEntity } from 'src/module/repository/entity/required-items.entity';

export class RequiredItem {
  @ApiProperty({ description: '아이템 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '아이템 이미지 URL' })
  @Expose()
  image: string;

  @ApiProperty({ description: '아이템 수' })
  @Expose()
  amount: number;

  static from(entity: RequiredItemsEntity) {
    return plainToInstance(this, {
      name: entity.item.contract.name,
      image: entity.item.imageUrl,
      amount: entity.itemAmount,
    });
  }
}

export class Unminted {
  @ApiProperty({
    type: RequiredItem,
    isArray: true,
    description: '잠금해제에 필요한 아이템',
  })
  @Expose()
  @Type(() => RequiredItem)
  requiredItems: RequiredItem[];

  static from(entity: PuzzlePieceEntity) {
    return plainToInstance(this, {
      requiredItems: entity.seasonZone.requiredItems.map((e) =>
        RequiredItem.from(e),
      ),
    });
  }
}

export class TokenOwner {
  @ApiProperty({ description: '토큰 보유 유저 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '토큰 보유 유저 지갑 주소' })
  @Expose()
  walletAddress: string;
}

export class Minted {
  @ApiProperty({ description: '시즌 타이틀' })
  @Expose()
  season: string;

  @ApiProperty({ type: TokenOwner, description: '토큰을 소유한 유저 정보' })
  @Expose()
  @Type(() => TokenOwner)
  owner: TokenOwner;

  @ApiProperty({ description: '토큰 아이디' })
  @Expose()
  tokenId: number;

  @ApiProperty({ description: 'NFT 썸네일 이미지 URL' })
  @Expose()
  nftThumbnailUrl: String;

  static from(entity: PuzzlePieceEntity) {
    return plainToInstance(
      this,
      {
        ...entity?.metadata,
        owner: {
          ...entity?.owner,
        },
        season: entity.seasonZone.season.title,
        nftThumbnailUrl: entity?.metadata.metadata?.image,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

@ApiExtraModels(Minted, Unminted)
export class PuzzlePieceDto {
  @ApiProperty({ description: '구역 ID' })
  @Expose()
  zoneId: number;

  @ApiProperty()
  @Expose()
  zoneNameKr: string;

  @ApiProperty()
  @Expose()
  zoneNameUs: string;

  @ApiProperty({ description: '퍼즐 조각 아이디' })
  @Expose()
  pieceId: number;

  @ApiProperty({ type: Point, description: '퍼즐 조각 좌표 목록' })
  @Expose()
  @Type(() => Point)
  points: Point[];

  @ApiProperty({ description: 'minted=이미 민트됨(잠금해제 완료)' })
  @Expose()
  minted: boolean;

  @ApiProperty({
    description: '',
    type: '잠금해제된 퍼즐조각의 경우 "발행된 NFT와 소유 유저 정보"\n\
    그 외: "잠금해제에 필요한 아이템 정보"',
    oneOf: [
      {
        $ref: getSchemaPath(Minted),
      },
      {
        $ref: getSchemaPath(Unminted),
      },
    ],
  })
  @Expose()
  data: Minted | Unminted;

  static from(entity: PuzzlePieceEntity) {
    const data = entity.minted ? Minted.from(entity) : Unminted.from(entity);

    return plainToInstance(
      this,
      {
        ...entity,
        zoneId: entity.seasonZone.zoneId,
        pieceId: entity.id,
        zoneNameKr: entity.seasonZone.zone.nameKr,
        zoneNameUs: entity.seasonZone.zone.nameUs,
        data,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

export class PuzzleResponse {
  @ApiProperty({ description: '총 퍼즐 조각 수' })
  total: number;

  @ApiProperty({ description: '민트된 퍼즐 조각 수' })
  minted: number;

  @ApiProperty({ type: PuzzlePieceDto, isArray: true })
  pieces: PuzzlePieceDto[];
}

export class PuzzleRequest {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  seasonId: number;
}
