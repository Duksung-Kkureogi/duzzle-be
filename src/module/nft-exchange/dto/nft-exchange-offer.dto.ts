import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NftExchangeOfferStatus } from 'src/module/repository/enum/nft-exchange-status.enum';

export class OfferorUserProfile {
  @ApiProperty()
  @Expose()
  walletAddress: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  image: string;
}

export class ExchangeMaterialNFT {
  @ApiProperty()
  contractId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  quantity: number;
}

export class ExchangeBlueprintOrPuzzleNFT {
  @ApiProperty()
  seasonZoneId: number;

  @ApiProperty()
  seasonName: string;

  @ApiProperty()
  zoneName: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  quantity: number;
}

@ApiExtraModels(
  OfferorUserProfile,
  ExchangeMaterialNFT,
  ExchangeBlueprintOrPuzzleNFT,
)
export class NftExchangeListDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  offerorUser: OfferorUserProfile;

  @ApiProperty({
    oneOf: [
      { type: 'object', $ref: getSchemaPath(ExchangeMaterialNFT) },
      { type: 'object', $ref: getSchemaPath(ExchangeBlueprintOrPuzzleNFT) },
    ],
  })
  @Expose()
  offeredNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];

  @ApiProperty({
    oneOf: [
      { type: 'object', $ref: getSchemaPath(ExchangeMaterialNFT) },
      { type: 'object', $ref: getSchemaPath(ExchangeBlueprintOrPuzzleNFT) },
    ],
  })
  @Expose()
  requestedNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];

  @ApiProperty()
  @Expose()
  status: NftExchangeOfferStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
