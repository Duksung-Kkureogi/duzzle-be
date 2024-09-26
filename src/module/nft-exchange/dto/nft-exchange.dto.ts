import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BlueprintOrPuzzleNFT, MaterialNFT, NFTAsset } from './nft-asset';

@ApiExtraModels(MaterialNFT, BlueprintOrPuzzleNFT)
export class PostNftExchangeRequest {
  @ApiProperty({
    description: '제공할 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFT) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFT) },
    ],
  })
  offeredNfts: NFTAsset[];

  @ApiProperty({
    description: '필요한 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFT) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFT) },
    ],
  })
  requestedNfts: NFTAsset[];
}
