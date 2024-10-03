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
  @Type((obj: any) => {
    if (obj?.type === NFTType.Material) {
      return MaterialNFT;
    } else {
      return BlueprintOrPuzzleNFT;
    }
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
  @Type((obj: any) => {
    if (obj?.type === NFTType.Material) {
      return MaterialNFT;
    } else {
      return BlueprintOrPuzzleNFT;
    }
  })
  requestedNfts: NFTAsset[];
}
