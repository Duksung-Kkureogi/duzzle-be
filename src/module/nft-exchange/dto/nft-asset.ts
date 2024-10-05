import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt } from 'class-validator';

export enum NFTType {
  Material = 'material',
  Blueprint = 'blueprint',
  PuzzlePiece = 'puzzlePiece',
}

export class NFTAsset {
  @ApiProperty()
  type: NFTType;
}

export class MaterialNFT extends NFTAsset {
  @ApiProperty({ enum: [NFTType.Material] })
  @IsEnum(NFTType)
  readonly type = NFTType.Material;

  @ApiProperty()
  @IsInt()
  contractId: number; // 컨트랙트 ID 유효성 검사 중요

  @ApiProperty()
  @IsInt()
  quantity: number;
}

export class BlueprintOrPuzzleNFT extends NFTAsset {
  @ApiProperty({ enum: [NFTType.Blueprint, NFTType.PuzzlePiece] })
  @IsEnum(NFTType)
  readonly type: NFTType.Blueprint | NFTType.PuzzlePiece;

  @ApiProperty()
  @IsInt()
  seasonZoneId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}
