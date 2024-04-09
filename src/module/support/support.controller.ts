import {
  Controller,
  HttpCode,
  Inject,
  Get,
  HttpStatus,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/module/auth/auth.guard';
import { SupportService } from './support.service';
import { ResponseList } from 'src/decorator/response-list.decorators';
import { FaqResponse, PostQuestionRequest } from './dto/support.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';

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

  @ApiTags('Support')
  @ApiOperation({ summary: '1:1 문의 등록' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  @Post('qna')
  async postQuestion(
    @Body() dto: PostQuestionRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    const { user } = this.req;
    await this.supportService.postQuestion(user.id, dto);

    return new ResponsesDataDto(true);
  }
}
