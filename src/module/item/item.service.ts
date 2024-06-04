import { ItemRepositoryService } from './../repository/service/item.repository.service';
import { Injectable } from '@nestjs/common';
import { Item, MyItemsResponse } from './dto/item.dto';

@Injectable()
export class ItemService {
  constructor(readonly itemRepositoryService: ItemRepositoryService) {}

  async getUserItems(userId: number): Promise<MyItemsResponse> {
    const [userMaterialItems, userBlueprintItems] = await Promise.all([
      await this.itemRepositoryService.findUserMaterialItems(userId),
      await this.itemRepositoryService.findUserBlueprintItems(userId),
    ]);

    let totalItems: number = 0;
    let items: Item[] = userMaterialItems.map((e) => {
      totalItems += e.count;

      return e;
    });

    items.push(
      ...userBlueprintItems.map((e) => {
        let item = Item.fromBlueprintDto(e);
        totalItems += item.count;

        return item;
      }),
    );

    const itemsSortedByCount = items.sort(function (a, b) {
      return b.count - a.count;
    });

    const result: MyItemsResponse = {
      totalItems,
      items: itemsSortedByCount,
    };

    return result;
  }
}
