import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseData } from 'src/decorator/response-data.decorator';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ItemService } from './item.service';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import { MyItemsResponse } from './dto/item.dto';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiTags('Item')
  @ApiOperation({ summary: '유저 보유 아이템 NFT 현황' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(MyItemsResponse)
  @Get('my/nft-items')
  async getPuzzleData(): Promise<ResponsesDataDto<MyItemsResponse>> {
    return;
  }
}
