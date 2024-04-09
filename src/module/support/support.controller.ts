import { Controller, HttpCode, Inject, Get, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SupportService } from './support.service';
import { ResponseList } from 'src/decorator/response-list.decorators';
import { FaqResponse } from './dto/support.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';

@Controller({
  path: 'support',
})
export class SupportController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(SupportService)
    private readonly supportService: SupportService,
  ) {}

  @ApiTags('Support')
  @ApiOperation({ summary: '자주 묻는 질문(FAQ) 목록' })
  @HttpCode(HttpStatus.OK)
  @ResponseList(FaqResponse)
  @Get('faq')
  async getFaqs(): Promise<ResponsesListDto<FaqResponse>> {
    const result = await this.supportService.getFaqs();

    return new ResponsesListDto(result);
  }
}
