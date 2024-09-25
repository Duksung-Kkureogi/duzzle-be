import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AvailableMaterialNFT,
  AvailableNftToOfferResponse,
} from 'src/module/nft-exchange/dto/available-nfts-to-offer.dto';
import { UserMaterialItemEntity } from '../entity/user-material-item.entity';
import { BlueprintItemEntity } from '../entity/blueprint-item.entity';
import { SeasonZoneEntity } from '../entity/season-zone.entity';
import { PuzzlePieceEntity } from '../entity/puzzle-piece.entity';
import { MaterialItemEntity } from '../entity/material-item.entity';
import { ZoneEntity } from '../entity/zone.entity';
import { SeasonEntity } from '../entity/season.entity';
import { NFTType } from 'src/module/nft-exchange/dto/nft-asset';
import { BLUEPRINT_ITEM_IMAGE_URL } from 'src/constant/item';

@Injectable()
export class NftExchangeRepositoryService {
  constructor(
    @InjectRepository(UserMaterialItemEntity)
    private userMaterialItemRepository: Repository<UserMaterialItemEntity>,

    @InjectRepository(BlueprintItemEntity)
    private blueprintItemRepository: Repository<BlueprintItemEntity>,

    @InjectRepository(PuzzlePieceEntity)
    private puzzlePieceRepository: Repository<PuzzlePieceEntity>,
  ) {}

  async getAvailableNFTsToOffer(
    userId: number,
    userWalletAddress: string,
  ): Promise<AvailableNftToOfferResponse> {
    const [materialNFTs, blueprintNFTs, puzzleNFTs] = await Promise.all([
      // 1. 사용자의 material NFT 조회
      this.userMaterialItemRepository
        .createQueryBuilder('umi')
        .select([
          'count(*) as "availableQuantity"',
          'mi.name_kr AS name',
          'mi.image_url AS "imageUrl"',
          'mi.contract_id AS "contractId"',
        ])
        .innerJoin(MaterialItemEntity, 'mi', 'umi.materialItemId = mi.id')
        .where('umi.userId = :userId', { userId })
        .groupBy('umi.material_item_id')
        .addGroupBy('mi.name_kr')
        .addGroupBy('mi.image_url')
        .addGroupBy('mi.contract_id')
        .execute(),

      // 2. 사용자의 blueprint NFT 조회
      this.blueprintItemRepository
        .createQueryBuilder('bi')
        .select([
          'sz.id AS "seasonZoneId"',
          's.title AS "seasonName"',
          'z.nameKr AS zoneName',
          'count(*) as "availableQuantity"',
        ])
        .innerJoin(SeasonZoneEntity, 'sz', 'bi.seasonZoneId = sz.id')
        .innerJoin(ZoneEntity, 'z', 'sz.zoneId = z.id')
        .innerJoin(SeasonEntity, 's', 'sz.seasonId = s.id')
        .where('bi.userId = :userId', { userId })
        // .andWhere('sz.seasonId = (select max(id) from season)')
        .andWhere('bi.minted')
        .andWhere('bi.burned = false')
        .groupBy('z.nameKr')
        .addGroupBy('sz.id')
        .addGroupBy('s.title')
        .execute(),

      // 3. 사용자의 puzzle piece NFT 조회
      this.puzzlePieceRepository
        .createQueryBuilder('pp')
        .select([
          'sz.id AS "seasonZoneId"',
          's.title AS "seasonName"',
          'z.nameKr AS zoneName',
          'count(*) as "availableQuantity"',
          'sz.puzzleThumbnailUrl AS "imageUrl"',
        ])
        .innerJoin(SeasonZoneEntity, 'sz', 'pp.seasonZoneId = sz.id')
        .innerJoin(ZoneEntity, 'z', 'sz.zoneId = z.id')
        .innerJoin(SeasonEntity, 's', 'sz.seasonId = s.id')
        .where('pp.holerWalletAddress = :userWalletAddress', {
          userWalletAddress,
        })
        .andWhere('pp.minted')
        // .andWhere('pp.burned = false') // TODO: 현재는 burn 기능이 없어서 미사용
        .groupBy('z.nameKr')
        .addGroupBy('sz.id')
        .addGroupBy('s.title')
        .addGroupBy('sz.puzzleThumbnailUrl')
        .execute(),
    ]);

    return {
      materials: materialNFTs.map((e) => {
        return {
          ...e,
          availableQuantity: parseInt(e.availableQuantity),
        } as AvailableMaterialNFT;
      }),
      blueprintsAndPuzzlePieces: blueprintNFTs
        .map((e) => {
          return {
            ...e,
            type: NFTType.Blueprint,
            availableQuantity: parseInt(e.availableQuantity),
            imageUrl: BLUEPRINT_ITEM_IMAGE_URL,
          };
        })
        .concat(
          puzzleNFTs.map((e) => {
            return {
              ...e,
              type: NFTType.PuzzlePiece,
              availableQuantity: parseInt(e.availableQuantity),
            };
          }),
        ),
    };
  }
}
