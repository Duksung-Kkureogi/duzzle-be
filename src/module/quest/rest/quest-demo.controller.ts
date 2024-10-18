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
import { QuestType } from 'src/module/repository/enum/quest.enum';

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
  @Post('duksae-jump/start')
  async startRandomQuest1(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.DuksaeJump,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(그림 퀴즈 나옴)',
  })
  @Post('picture-quiz/start')
  async startPictureQuiz(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.PictureQuiz,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(음악 퀴즈만 나옴)',
  })
  @Post('music-quiz/start')
  async startMusicQuiz(): Promise<ResponsesDataDto<StartRandomQuestResponse>> {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.PictureQuiz,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(산성비만 나옴)',
  })
  @Post('acidrain/start')
  async startAcidRain(): Promise<ResponsesDataDto<StartRandomQuestResponse>> {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.AcidRain,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(스피드 퀴즈만 나옴)',
  })
  @Post('speed-quiz/start')
  async startSpeedQuiz(): Promise<ResponsesDataDto<StartRandomQuestResponse>> {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.SpeedQuiz,
    );

    return new ResponsesDataDto(quest);
  }
}
