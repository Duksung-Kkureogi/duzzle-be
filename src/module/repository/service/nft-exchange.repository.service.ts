import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  AvailableBlueprintOrPuzzleNFT,
  AvailableMaterialNFT,
  AvailableNftDto,
} from 'src/module/nft-exchange/dto/available-nfts.dto';
import { UserMaterialItemEntity } from '../entity/user-material-item.entity';
import { BlueprintItemEntity } from '../entity/blueprint-item.entity';
import { SeasonZoneEntity } from '../entity/season-zone.entity';
import { PuzzlePieceEntity } from '../entity/puzzle-piece.entity';
import { MaterialItemEntity } from '../entity/material-item.entity';
import { ZoneEntity } from '../entity/zone.entity';
import { SeasonEntity } from '../entity/season.entity';
import { NFTType } from 'src/module/nft-exchange/dto/nft-asset';
import { BLUEPRINT_ITEM_IMAGE_URL } from 'src/constant/item';
import { PaginatedList } from 'src/dto/response.dto';
import { AvailableNftsToRequestRequest } from 'src/module/nft-exchange/dto/available-nfts-to-request.dto';

@Injectable()
export class NftExchangeRepositoryService {
  constructor(
    @InjectRepository(UserMaterialItemEntity)
    private userMaterialItemRepository: Repository<UserMaterialItemEntity>,

    @InjectRepository(BlueprintItemEntity)
    private blueprintItemRepository: Repository<BlueprintItemEntity>,

    @InjectRepository(PuzzlePieceEntity)
    private puzzlePieceRepository: Repository<PuzzlePieceEntity>,

    private readonly entityManager: EntityManager,
  ) {}

  async getAvailableNFTsToOffer(
    userId: number,
    userWalletAddress: string,
  ): Promise<AvailableNftDto[]> {
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

    return [
      ...materialNFTs.map((e) => {
        return {
          type: NFTType.Material,
          nftInfo: <AvailableMaterialNFT>{
            contractId: parseInt(e.contractId),
            name: e.name,
            imageUrl: e.imageUrl,
            availableQuantity: parseInt(e.availableQuantity),
          },
        };
      }),
      ...blueprintNFTs.map((e) => {
        return {
          type: NFTType.Blueprint,
          nftInfo: {
            seasonZoneId: parseInt(e.seasonZoneId),
            seasonName: e.seasonName,
            zoneName: e.zoneName,
            imageUrl: BLUEPRINT_ITEM_IMAGE_URL,
            availableQuantity: parseInt(e.availableQuantity),
          },
        };
      }),
      ...puzzleNFTs.map((e) => {
        return {
          type: NFTType.PuzzlePiece,
          nftInfo: {
            seasonZoneId: parseInt(e.seasonZoneId),
            seasonName: e.seasonName,
            zoneName: e.zoneName,
            imageUrl: e.imageUrl,
            availableQuantity: parseInt(e.availableQuantity),
          },
        };
      }),
    ];
  }

  private createUnionQuery(name: string | undefined): [string, any[]] {
    const parameters: any[] = [];
    let parameterIndex = 1;

    const materialNameCondition = name
      ? `AND mi.name_kr ILIKE $${parameterIndex++}`
      : '';
    const blueprintPuzzleNameCondition = name
      ? `AND (z.name_kr ILIKE $${parameterIndex++} OR s.title ILIKE $${parameterIndex++})`
      : '';

    if (name) {
      parameters.push(`%${name}%`, `%${name}%`, `%${name}%`);
    }

    const query = `
      SELECT 
        count(*) as "availableQuantity",
        mi.name_kr AS name,
        mi.image_url AS "imageUrl",
        mi.contract_id AS "contractId",
        NULL AS "seasonZoneId",
        NULL AS "seasonName",
        '${NFTType.Material}' AS type
      FROM user_material_item umi
      INNER JOIN material_item mi ON umi.material_item_id = mi.id
      WHERE 1=1 ${materialNameCondition}
      GROUP BY umi.material_item_id, mi.name_kr, mi.image_url, mi.contract_id
  
      UNION ALL
  
      SELECT 
        count(*) as "availableQuantity",
        z.name_kr AS name,
        '${BLUEPRINT_ITEM_IMAGE_URL}' AS "imageUrl",
        NULL AS "contractId",
        sz.id AS "seasonZoneId",
        s.title AS "seasonName",
        '${NFTType.Blueprint}' AS type
      FROM blueprint_item bi
      INNER JOIN season_zone sz ON bi.season_zone_id = sz.id
      INNER JOIN zone z ON sz.zone_id = z.id
      INNER JOIN season s ON sz.season_id = s.id
      WHERE bi.user_id IS NOT NULL
        AND bi.minted = true
        AND bi.burned = false
        ${blueprintPuzzleNameCondition}
      GROUP BY z.name_kr, sz.id, s.title
  
      UNION ALL
  
      SELECT 
        count(*) as "availableQuantity",
        z.name_kr AS name,
        sz.puzzle_thumbnail_url AS "imageUrl",
        NULL AS "contractId",
        sz.id AS "seasonZoneId",
        s.title AS "seasonName",
        '${NFTType.PuzzlePiece}' AS type
      FROM puzzle_piece pp
      INNER JOIN season_zone sz ON pp.season_zone_id = sz.id
      INNER JOIN zone z ON sz.zone_id = z.id
      INNER JOIN season s ON sz.season_id = s.id
      WHERE pp.holer_wallet_address IS NOT NULL
        AND pp.minted = true
        ${blueprintPuzzleNameCondition}
      GROUP BY z.name_kr, sz.id, s.title, sz.puzzle_thumbnail_url
    `;

    return [query, parameters];
  }

  async getAvailableNFTsToRequestPaginated(
    params: AvailableNftsToRequestRequest,
  ): Promise<PaginatedList<AvailableNftDto>> {
    const { page, count, name } = params;
    const offset = page * count;

    const [innerQuery, parameters] = this.createUnionQuery(name);

    const query = `
      SELECT * FROM (
        ${innerQuery}
      ) AS combined_results
      ORDER BY 
        CASE 
          WHEN type = '${NFTType.Material}' THEN 0 
          WHEN type = '${NFTType.Blueprint}' THEN 1
          WHEN type = '${NFTType.PuzzlePiece}' THEN 2
          ELSE 3
        END,
        name
      LIMIT $${parameters.length + 1} OFFSET $${parameters.length + 2}
    `;

    const countQuery = `SELECT COUNT(*) as total FROM (${innerQuery}) as count_query`;

    const [items, totalCountResult] = await Promise.all([
      this.entityManager.query(query, [...parameters, count, offset]),
      this.entityManager.query(countQuery, parameters),
    ]);

    const total = parseInt(totalCountResult[0].total);
    const list = this.mapResultsToDto(items);

    return {
      list,
      total,
    };
  }

  private mapResultsToDto(results: any[]): AvailableNftDto[] {
    return results.map((result) => ({
      type: result.type as NFTType,
      nftInfo:
        result.type === NFTType.Material
          ? <AvailableMaterialNFT>{
              contractId: result.contractId
                ? parseInt(result.contractId)
                : null,
              name: result.name,
              imageUrl: result.imageUrl,
              availableQuantity: parseInt(result.availableQuantity),
            }
          : <AvailableBlueprintOrPuzzleNFT>{
              seasonZoneId: result.seasonZoneId
                ? parseInt(result.seasonZoneId)
                : null,
              seasonName: result.seasonName,
              zoneName: result.name,
              imageUrl: result.imageUrl,
              availableQuantity: parseInt(result.availableQuantity),
            },
    }));
  }
}
