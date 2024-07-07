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
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import {
  StoryRequest,
  StoryResponse,
  UpdateUserStoryProgressRequest,
  UserStoryProgressResponse,
} from './dto/story.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ApiDescription } from 'src/decorator/api-description.decorator';
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
    exceptions: [ContentNotFoundError],
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
    summary: '유저 스토리 진행도 조회',
    dataResponse: {
      status: HttpStatus.OK,
      schema: UserStoryProgressResponse,
    },
    exceptions: [ContentNotFoundError],
  })
  @HttpCode(HttpStatus.OK)
  @Get('progress')
  async getUserStoryProgress(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesListDto<UserStoryProgressResponse>> {
    const result = await this.storyService.getUserStoryProgress(user.id);

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
    // exceptions: [ContentNotFoundError], // TODO:
  })
  @HttpCode(HttpStatus.OK)
  @Patch('progress')
  async updateUserStoryProgress(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: UpdateUserStoryProgressRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.storyService.updateUserStoryProgress(user.id, dto);

    return new ResponsesDataDto(true);
  }
}
