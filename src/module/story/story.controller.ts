import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { StoryRequest, StoryResponse } from './dto/story.dto';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { InvalidParamsError } from 'src/types/error/application-exceptions/400-bad-request';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
  UpdateUserStoryProgressRequest,
} from './dto/story-progress.dto';

@Controller({
  path: 'story',
})
export class StoryController {
  constructor(
    @Inject(StoryService)
    private readonly storyService: StoryService,
  ) {}

  @ApiDescription({
    tags: 'Story',
    summary: '스토리 특정 페이지 조회',
    description: `
    스토리 페이지는 1부터 시작\n
    0 이하 숫자 입력 시, 400 INVALID_PARAMETER
    `,
    dataResponse: {
      status: HttpStatus.OK,
      schema: StoryResponse,
    },
    exceptions: [InvalidParamsError, ContentNotFoundError],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getStory(
    @Query() query: StoryRequest,
  ): Promise<ResponsesDataDto<StoryResponse>> {
    const { storyId, page } = query;
    const result = await this.storyService.getStoryByPage(storyId, page);

    return new ResponsesDataDto(result);
  }

  @ApiDescription({
    tags: 'Story',
    summary: '스토리 진척도 수정',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [InvalidParamsError],
  })
  @UseGuards(AuthGuard)
  @Patch('progress')
  async updateUserStoryProgress(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: UpdateUserStoryProgressRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.storyService.updateUserStoryProgress(user.id, dto);

    return new ResponsesDataDto(true);
  }

  @ApiDescription({
    tags: 'Story',
    summary: '스토리 목록 조회(로그인시)',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressResponse,
    },
  })
  @UseGuards(AuthGuard)
  @Get('progress')
  async getStoryProgress(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesListDto<StoryProgressResponse>> {
    return new ResponsesListDto(
      await this.storyService.getUserStoryProgress(user.id),
    );
  }

  @ApiDescription({
    tags: 'Story',
    summary: '구역별 스토리 목록 조회(로그인시)',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressByZoneResponse,
    },
  })
  @UseGuards(AuthGuard)
  @Get('progress/:zoneId')
  async getStoryProgressByZone(
    @AuthenticatedUser() user: UserEntity,
    @Param('zoneId', ParseIntPipe) zoneId: number,
  ): Promise<ResponsesListDto<StoryProgressByZoneResponse>> {
    return new ResponsesListDto(
      await this.storyService.getUserStoryProgressByZone(user.id, zoneId),
    );
  }
}
