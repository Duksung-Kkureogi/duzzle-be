import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { NftExchangeOfferStatus } from 'src/module/repository/enum/nft-exchange-status.enum';

export class OfferorUserProfile {
  @ApiProperty()
  @Expose()
  walletAddress: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  name?: string | null = null;

  @ApiProperty()
  @Expose()
  image: string;
}

export class ExchangeMaterialNFT {
  @ApiProperty()
  @Expose()
  contractId: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  imageUrl?: string;

  @ApiProperty()
  @Expose()
  quantity: number;
}

export class ExchangeBlueprintOrPuzzleNFT {
  @ApiProperty()
  @Expose()
  seasonZoneId: number;

  @ApiProperty()
  @Expose()
  seasonName: string;

  @ApiProperty()
  @Expose()
  zoneName: string;

  @ApiProperty()
  @Expose()
  imageUrl?: string | null = null;

  @ApiProperty()
  @Expose()
  quantity: number;
}

@ApiExtraModels(
  OfferorUserProfile,
  ExchangeMaterialNFT,
  ExchangeBlueprintOrPuzzleNFT,
)
export class NftExchangeOfferResponse {
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

  @ApiProperty({ type: 'enum', enum: NftExchangeOfferStatus })
  @Expose()
  @IsEnum(NftExchangeOfferStatus)
  status: NftExchangeOfferStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
