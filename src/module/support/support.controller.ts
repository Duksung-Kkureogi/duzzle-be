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

  // id, questionId => 통일할 것!!!

  @ApiTags('Support')
  @ApiOperation({ summary: '1:1 문의 수정' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Put('qna/:id')
  async updateQuestion(
    @Param('id') id: number, // qnaId
    @Body() dto: PostQuestionRequest, // UpdateQuestionRequest ???
  ): Promise<ResponsesDataDto<boolean>> {
    const { user } = this.req
    // 1. question id로 조회 => Question not found
    // 2. question 작성자 조회 및 비교 => Not authorized to delete question
    await this.supportService.updateQuestion(user.id, id, dto)

    return new ResponsesDataDto(true)
  }

  @ApiTags('Support')
  @ApiOperation({ summary: '1:1 문의 삭제' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  // @ApiOkResponse() => Swagger API 문서에서 성공적인 응답에 대한 설명 제공. 엔드포인트의 응답 형식 및 내용 제공
  // @ResponseException() ???
  @Delete('qna/:questionId')
  async deleteQuestion(
    @Param('questionId') questionId: number,
  ): Promise<void> {
    const { user } = this.req
    // 1. question id로 조회 => Question not found
    // const question = await this.supportService.getQuestionById(questionId)
    // if(!question) {
    //   throw new HttpError(
    //     HttpStatus.NOT_FOUND,
    //     ExceptionCode.NotFound
    //   )
    // }
    // 2. question 작성자 조회 및 비교 => Not authorized to delete question
    // if (question.userId != user.id) { throw new HttpError()}
    await this.supportService.deleteQuestion(user.id, questionId)
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
}
