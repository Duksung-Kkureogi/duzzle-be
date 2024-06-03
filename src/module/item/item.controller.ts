import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseData } from 'src/decorator/response-data.decorator';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ItemService } from './item.service';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import { MyItemsResponse } from './dto/item.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Controller()
export class ItemController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    private readonly itemService: ItemService,
  ) {}

  @ApiTags('Item')
  @ApiOperation({ summary: '유저 보유 아이템 NFT 현황(현재 시즌만 해당)' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(MyItemsResponse)
  @Get('my/nft-items')
  async getPuzzleData(): Promise<ResponsesDataDto<MyItemsResponse>> {
    const user = this.req.user;
    const result = await this.itemService.getUserItems(user.id);

    return new ResponsesDataDto(result);
  }
}
