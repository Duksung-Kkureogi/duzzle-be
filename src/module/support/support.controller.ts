import {
  Controller,
  HttpCode,
  Inject,
  Get,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Put,
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
import {
  FaqResponse,
  PostQuestionRequest,
  QnaResponse,
} from './dto/support.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { ResponseException } from 'src/decorator/response-exception.decorator';
import { ExceptionCode } from 'src/constant/exception';
import { ResponseData } from 'src/decorator/response-data.decorator';

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

  @ApiTags('Support')
  @ApiOperation({ summary: '1:1 문의 수정' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ResponseException(HttpStatus.NOT_FOUND, [ExceptionCode.NotFound])
  @Put('qna/:questionId')
  async updateQuestion(
    @Param('questionId') questionId: number,
    @Body() dto: PostQuestionRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    const { user } = this.req;
    await this.supportService.updateQuestion(user.id, questionId, dto);

    return new ResponsesDataDto(true);
  }

  @ApiTags('Support')
  @ApiOperation({ summary: '1:1 문의 삭제' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ResponseException(HttpStatus.NOT_FOUND, [ExceptionCode.NotFound])
  @Delete('qna/:questionId')
  async deleteQuestion(@Param('questionId') questionId: number): Promise<void> {
    const { user } = this.req;
    await this.supportService.deleteQuestion(user.id, questionId);
  }

  @ApiTags('Support')
  @ApiOperation({
    summary: '1:1 문의 목록',
    description: '유저가 등록한 1:1 문의 목록, 마지막 수정 시간 내림차순 정렬',
  })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseList(QnaResponse)
  @Get('qna')
  async getQnas(): Promise<ResponsesListDto<QnaResponse>> {
    const { user } = this.req;
    const result = await this.supportService.getQnasByUserId(user.id);

    return new ResponsesListDto(result);
  }

  @ApiTags('Support')
  @ApiOperation({
    summary: '특정 1:1 문의 조회',
  })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(QnaResponse)
  @Get('qna:id')
  async getQnaById(
    @Param('id') id: number,
  ): Promise<ResponsesDataDto<QnaResponse>> {
    const { user } = this.req;
    const result = await this.supportService.getQnaById(user.id, id);

    return new ResponsesDataDto(result);
  }
}
