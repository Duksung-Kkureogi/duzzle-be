import { ApiProperty } from '@nestjs/swagger';
import { NFTType } from './nft-asset';

export class AvailableMaterialNFT {
  @ApiProperty()
  contractId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  availableQuantity: number;
}

export class AvailableBlueprintOrPuzzleNFT {
  @ApiProperty({ type: 'enum', enum: [NFTType.Blueprint, NFTType.PuzzlePiece] })
  type: NFTType.Blueprint | NFTType.PuzzlePiece;

  @ApiProperty()
  seasonZoneId: number;

  @ApiProperty()
  seasonName: string;

  @ApiProperty()
  zoneName: string;

  @ApiProperty({
    description: '설계도면은 모두 동일, 퍼즐 조각은 시즌/구역마다 다름',
    nullable: true,
  })
  imageUrl: string;

  @ApiProperty()
  availableQuantity: number;
}

export class AvailableNftToOfferResponse {
  @ApiProperty({ type: [AvailableMaterialNFT] })
  materials: AvailableMaterialNFT[];

  @ApiProperty({ type: [AvailableBlueprintOrPuzzleNFT] })
  blueprintsAndPuzzlePieces: AvailableBlueprintOrPuzzleNFT[];
}
