import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  BlueprintOrPuzzleNFT,
  MaterialNFT,
  NFTAsset,
  NFTType,
} from './nft-asset';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@ApiExtraModels(MaterialNFT, BlueprintOrPuzzleNFT)
export class PostNftExchangeRequest {
  @ApiProperty({
    description: '제공할 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFT) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFT) },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NFTAsset, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MaterialNFT, name: NFTType.Material },
        { value: BlueprintOrPuzzleNFT, name: NFTType.Blueprint },
        { value: BlueprintOrPuzzleNFT, name: NFTType.PuzzlePiece },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  offeredNfts: NFTAsset[];

  @ApiProperty({
    description: '필요한 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFT) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFT) },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NFTAsset, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MaterialNFT, name: NFTType.Material },
        { value: BlueprintOrPuzzleNFT, name: NFTType.Blueprint },
        { value: BlueprintOrPuzzleNFT, name: NFTType.PuzzlePiece },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  requestedNfts: NFTAsset[];
}
