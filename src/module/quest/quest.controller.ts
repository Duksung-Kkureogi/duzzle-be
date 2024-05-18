import {
  Controller,
  HttpCode,
  Inject,
  Post,
  HttpStatus,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { ExceptionCode } from 'src/constant/exception';
import { ResponseException } from 'src/decorator/response-exception.decorator';
import { QuestService } from './quest.service';
import { GetResultRequest, StartRandomQuestResponse } from './dto/quest.dto';
import { UserGuard } from '../auth/auth.guard';
import { ApiResponseBooleanTrue } from 'src/constant/api-ok-response-boolean';
import { StartQuestInterceptor } from './quest.interceptor';

@Controller({
  path: 'quest',
})
export class QuestController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}

  // TODO: quest response 암호화
  @ApiTags('Quest')
  @ApiOperation({ summary: '랜덤 퀘스트 시작하기' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @ResponseData(StartRandomQuestResponse)
  @ResponseException(HttpStatus.CONFLICT, [ExceptionCode.LimitExceeded])
  @UseInterceptors(StartQuestInterceptor)
  @UserGuard()
  @Post('start')
  async startRandomQuest(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const { user } = this.req;
    const quest = await this.questService.getRandomQuest(user.id);

    return new ResponsesDataDto(quest);
  }

  @ApiTags('Quest')
  @ApiOperation({ summary: '퀘스트 결과' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse(ApiResponseBooleanTrue)
  @ResponseException(HttpStatus.CONFLICT, [ExceptionCode.LimitExceeded])
  @UserGuard()
  @Post('result')
  async getResult(
    @Body() params: GetResultRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    const { user } = this.req;
    const result = await this.questService.getResult(user.id, params);

    return new ResponsesDataDto(result);
  }
}
