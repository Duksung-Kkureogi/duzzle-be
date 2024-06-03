import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MaterialItemEntity } from '../entity/material-item.entity';
import { BlueprintItemEntity } from '../entity/blueprint-item.entity';
import { UserMaterialItemEntity } from '../entity/user-material-item.entity';
import { Item } from 'src/module/item/dto/item.dto';
import { SeasonZoneEntity } from '../entity/season-zone.entity';
import { ZoneEntity } from '../entity/zone.entity';
import { SeasonEntity } from '../entity/season.entity';
import { UserBlueprintItemsDto } from '../dto/item.dto';

@Injectable()
export class ItemRepositoryService {
  constructor(
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
}
