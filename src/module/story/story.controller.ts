import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoryService } from './story.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { ResponseException } from 'src/decorator/response-exception.decorator';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ExceptionCode } from 'src/constant/exception';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  StoryRequest,
  StoryResponse,
  UpdateUserStoryProgressRequest,
  UserStoryProgressResponse,
} from './dto/story.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import { ResponsesListDto } from 'src/dto/responses-list.dto';

@Controller({
  path: 'story',
})
export class StoryController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(StoryService)
    private readonly storyService: StoryService,
  ) {}

  @ApiTags('Story')
  @ApiOperation({
    summary: '스토리 특정 페이지 조회',
    description: `
    스토리 페이지는 1부터 시작\n
    0 이하 숫자 입력 시, 400 INVALID_PARAMETER
    `,
  })
  @HttpCode(HttpStatus.OK)
  @ResponseData(StoryResponse)
  @ResponseException(HttpStatus.NOT_FOUND, [ExceptionCode.NotFound])
  @Get('')
  async getStory(
    @Query() query: StoryRequest,
  ): Promise<ResponsesDataDto<StoryResponse>> {
    const { storyId, page } = query;
    const result = await this.storyService.getStoryByPage(storyId, page);

    return new ResponsesDataDto(result);
  }

  @ApiTags('Story')
  @ApiOperation({ summary: '유저 스토리 진행도 조회' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(UserStoryProgressResponse)
  @Get('progress')
  async getUserStoryProgress(): Promise<
    ResponsesListDto<UserStoryProgressResponse>
  > {
    const { user } = this.req;
    const result = await this.storyService.getUserStoryProgress(user.id);

    return new ResponsesListDto(result);
  }

  @ApiTags('Story')
  @ApiOperation({ summary: '유저 스토리별 진행도 수정' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Patch('progress')
  async updateUserStoryProgress(
    @Body() dto: UpdateUserStoryProgressRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    const { user } = this.req;

    await this.storyService.updateUserStoryProgress(user.id, dto);

    return new ResponsesDataDto(true);
  }
}
