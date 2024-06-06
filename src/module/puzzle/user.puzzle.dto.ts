import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { PuzzlePieceEntity } from '../repository/entity/puzzle-piece.entity';
import { PaginationDto } from 'src/dto/request.dto';

export class UserPuzzleRequest extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  season?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zone?: number;
}

export class UserPuzzleResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty()
  @Expose()
  zoneUs: string;

  @ApiProperty()
  @Expose()
  zoneKr: string;

  static from(entity: PuzzlePieceEntity) {
    // zone name
    const { nameKr, nameUs } = entity.seasonZone.zone;

    const name: string = `${entity.metadata.metadata.name}#${entity.metadata.tokenId}`;
    return plainToInstance(
      this,
      {
        ...entity,
        name,
        image: entity.metadata.metadata.image,
        zoneUs: nameUs,
        zoneKr: nameKr,
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class UserPuzzlePathParams {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class UserPuzzleDetailResponse {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  tokenId: number;

  @ApiProperty()
  @Expose()
  contractAddress: string;

  @ApiProperty()
  @Expose()
  collection: string;

  @ApiProperty({ required: false })
  @Expose()
  architect?: string;

  @ApiProperty()
  @Expose()
  zone: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  readMoreLink: string;

  @ApiProperty()
  @Expose()
  interactive3DModelLink: string;

  // TODO: metadata.attributes 를 JSON key value 로 표현하기
  static from(entity: PuzzlePieceEntity, contractAddress: string) {
    const metadata = entity.metadata.metadata;
    const architect = metadata.attributes.find(
      (e) => e.trait_type === 'architect',
    ).value;
    return plainToInstance(
      this,
      {
        ...entity,
        ...entity.metadata,
        ...entity.metadata.metadata.attributes,
        collection: entity.seasonZone.season.title,
        contractAddress,
        architect,
        name: entity.metadata.metadata.name.concat(
          `#${entity.metadata.tokenId}`,
        ),
        zone: `${entity.seasonZone.zone.nameKr}(${entity.seasonZone.zone.nameUs})`,
        readMoreLink: '',
        interactive3DModelLink: '',
      },
      { excludeExtraneousValues: true },
    );
  }
}
