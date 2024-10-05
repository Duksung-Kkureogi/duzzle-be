import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  IntersectionType,
} from '@nestjs/swagger';
import {
  BlueprintOrPuzzleNFT,
  MaterialNFT,
  NFTAsset,
  NFTType,
} from '../domain/nft-asset';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { NftExchangeOfferStatus } from 'src/module/repository/enum/nft-exchange-status.enum';
import { NftExchangeOfferEntity } from 'src/module/repository/entity/nft-exchange-offers.entity';
import { UserEntity } from 'src/module/repository/entity/user.entity';

export class MaterialNFTDTO implements MaterialNFT {
  @ApiProperty({ enum: [NFTType.Material] })
  @IsEnum(NFTType)
  type: NFTType.Material = NFTType.Material;

  @ApiProperty()
  @IsInt()
  contractId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}

export class BlueprintOrPuzzleNFTDTO implements BlueprintOrPuzzleNFT {
  @ApiProperty({ enum: [NFTType.Blueprint, NFTType.PuzzlePiece] })
  @IsEnum(NFTType)
  type: NFTType.Blueprint | NFTType.PuzzlePiece;

  @ApiProperty()
  @IsInt()
  seasonZoneId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}

@ApiExtraModels(MaterialNFTDTO, BlueprintOrPuzzleNFTDTO)
export class PostNftExchangeRequest {
  @ApiProperty({
    description: '제공할 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFTDTO) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFTDTO) },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MaterialNFTDTO, name: NFTType.Material },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.Blueprint },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.PuzzlePiece },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  offeredNfts: NFTAsset[];

  @ApiProperty({
    description: '필요한 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFTDTO) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFTDTO) },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MaterialNFTDTO, name: NFTType.Material },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.Blueprint },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.PuzzlePiece },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  requestedNfts: NFTAsset[];
}

export class NftExchangeListRequest {
  @ApiProperty()
  @IsOptional()
  @IsEnum(NftExchangeOfferStatus)
  status?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  requestedNfts?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  offeredNfts?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  offerorUser?: string;
}

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

  static from(entity: UserEntity) {
    return plainToInstance(this, entity, { excludeExtraneousValues: true });
  }
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
export class NftExchangeListResponse {
  @ApiProperty()
  @Expose()
  nftExchangeOfferId: number;

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

  static from(entity: NftExchangeOfferEntity) {
    return plainToInstance(
      this,
      {
        ...entity,
        nftExchangeOfferId: entity.id,
        offerorUser: OfferorUserProfile.from(entity.offeror),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
