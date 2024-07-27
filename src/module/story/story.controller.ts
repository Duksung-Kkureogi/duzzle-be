import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
  StoryRequest,
  StoryResponse,
  UpdateStoryProgressRequest,
} from './dto/story.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { InvalidParamsError } from 'src/types/error/application-exceptions/400-bad-request';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { AuthorizationToken } from 'src/constant/authorization-token';

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

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Story',
    auth: AuthorizationToken.BearerUserToken,
    summary: '유저 구역별 스토리 진행도 조회',
    dataResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('/progress')
  async getStoryProgress(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesListDto<StoryProgressResponse>> {
    const result = await this.storyService.getStoryProgress(user.id);

    return new ResponsesListDto(result);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Story',
    auth: AuthorizationToken.BearerUserToken,
    summary: '유저 특정 구역 스토리 진행도 조회',
    dataResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressByZoneResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('/progress/:zoneId')
  async getStoryProgressByZone(
    @AuthenticatedUser() user: UserEntity,
    @Param('zoneId') zoneId: number,
  ): Promise<ResponsesListDto<StoryProgressByZoneResponse>> {
    const result = await this.storyService.getStoryProgressByZone(
      user.id,
      zoneId,
    );

    return new ResponsesListDto(result);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Story',
    auth: AuthorizationToken.BearerUserToken,
    summary: '유저 스토리별 진행도 수정',
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [InvalidParamsError, ContentNotFoundError],
  })
  @HttpCode(HttpStatus.OK)
  @Patch('progress')
  async updateUserStoryProgress(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: UpdateStoryProgressRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.storyService.updateStoryProgress(user.id, dto);

    return new ResponsesDataDto(true);
  }
}
