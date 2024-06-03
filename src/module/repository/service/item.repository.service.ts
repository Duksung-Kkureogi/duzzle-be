import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MaterialItemEntity } from '../entity/material-item.entity';
import { BlueprintItemEntity } from '../entity/blueprint-item.entity';
import { UserMaterialItemEntity } from '../entity/user-material-item.entity';
import { Item } from 'src/module/item/dto/item.dto';
import { SeasonZoneEntity } from '../entity/season-zone.entity';
import { ZoneEntity } from '../entity/zone.entity';
import { UserBlueprintItemsDto } from '../dto/item.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class ItemRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(MaterialItemEntity)
    private materialItemRepository: Repository<MaterialItemEntity>,

    @InjectRepository(UserMaterialItemEntity)
    private userMaterialItemRepository: Repository<UserMaterialItemEntity>,

    @InjectRepository(BlueprintItemEntity)
    private blueprintItemRepository: Repository<BlueprintItemEntity>,
  ) {}

  async findUserMaterialItems(userId: number): Promise<Item[]> {
    const userMaterialItems = await this.userMaterialItemRepository
      .createQueryBuilder('ui')
      .select(['count(*)', 'mi.name_kr AS name', 'mi.image_url AS image'])
      .innerJoin(MaterialItemEntity, 'mi', 'ui.materialItemId = mi.id')
      .where('ui.userId = :userId', { userId })
      .groupBy('ui.material_item_id')
      .addGroupBy('mi.name_kr')
      .addGroupBy('mi.image_url')
      .execute();

    return userMaterialItems.map((e) => {
      return {
        ...e,
        count: parseInt(e.count),
      };
    });
  }

  async findUserBlueprintItems(
    userId: number,
  ): Promise<UserBlueprintItemsDto[]> {
    const userBlueprintItems: UserBlueprintItemsDto[] =
      await this.blueprintItemRepository
        .createQueryBuilder('bi')
        .select(['z.nameKr AS zone', 'count(*)'])
        .innerJoin(SeasonZoneEntity, 'sz', 'bi.seasonZoneId = sz.id')
        .innerJoin(ZoneEntity, 'z', 'sz.zoneId = z.id')
        .where('bi.userId = :userId', { userId })
        .andWhere('sz.seasonId = (select max(id) from season)')
        .andWhere('bi.minted')
        .groupBy('z.nameKr')
        .execute();

    return userBlueprintItems;
  }

  async updateBlueprintOwner(
    tokenId: number,
    walletAddress: string,
  ): Promise<void> {
    await this.blueprintItemRepository.query(
      `
      UPDATE blueprint_item bi
      SET minted  = true,
          user_id = (select id from "user" where wallet_address = $1)
      FROM nft_metadata nm
      WHERE nm.id = bi.nft_metadata_id
        AND nm.token_id = $2;`,
      [walletAddress, tokenId],
    );
  }

  async upsertMaterialOnwer(
    tokenId: number,
    walletAddress: string,
    materialContractAddress: string,
  ) {
    const userExists = await this.userRepository.findOneBy({ walletAddress });
    const materialItemId = (
      await this.materialItemRepository.findOne({
        where: { contract: { address: materialContractAddress } },
      })
    ).id;
    if (userExists) {
      await this.userMaterialItemRepository.upsert(
        {
          tokenId,
          materialItemId,
          userId: userExists.id,
        },
        {
          conflictPaths: {
            tokenId: true,
            materialItemId: true,
          },
        },
      );
    }
  }
}
