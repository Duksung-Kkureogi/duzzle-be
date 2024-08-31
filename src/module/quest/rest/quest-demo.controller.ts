import {
  Controller,
  HttpCode,
  Inject,
  Post,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { ExceptionCode } from 'src/constant/exception';
import { ResponseException } from 'src/decorator/response-exception.decorator';
import { QuestService } from '../quest.service';
import { GetResultRequest, StartRandomQuestResponse } from './dto/quest.dto';

@Controller({
  path: 'quest/demo',
})
export class QuestDemoController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(덕새점프만 나옴)',
  })
  @ResponseData(StartRandomQuestResponse)
  @Post('duksae-jump/start')
  async startRandomQuest1(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const quest = await this.questService.getDuksaeJumpQuest({
      ipAddress: this.req.ip,
      userAgent: this.req.headers['user-agent'],
    });

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '산성비-스피드퀴즈 번갈아 나오는 퀘스트',
  })
  @ResponseData(StartRandomQuestResponse)
  @Post('acidrain-speed/start')
  async startRandomQuest2(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const quest = await this.questService.getAcidRainSpeedQuest({
      ipAddress: this.req.ip,
      userAgent: this.req.headers['user-agent'],
    });

    return new ResponsesDataDto(quest);
  }
}
