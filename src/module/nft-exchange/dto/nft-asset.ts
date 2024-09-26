import { ApiProperty } from '@nestjs/swagger';

export enum NFTType {
  Material = 'material',
  Blueprint = 'blueprint',
  PuzzlePiece = 'puzzlePiece',
}

export class MaterialNFT {
  @ApiProperty({ enum: [NFTType.Material] })
  readonly type = NFTType.Material;

  @ApiProperty()
  contractId: number; // 컨트랙트 ID 유효성 검사 중요

  @ApiProperty()
  quantity: number;
}

export class BlueprintOrPuzzleNFT {
  @ApiProperty({ enum: [NFTType.Blueprint, NFTType.PuzzlePiece] })
  readonly type: NFTType.Blueprint | NFTType.PuzzlePiece;

  @ApiProperty()
  seasonZoneId: number;

  @ApiProperty()
  quantity: number;
}

export type NFTAsset = MaterialNFT | BlueprintOrPuzzleNFT;
