import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
} from './dto/story-progress.dto';
import { StoryService } from './story.service';
import { ResponsesListDto } from 'src/dto/responses-list.dto';

@Controller({
  path: 'story/guest',
})
export class StoryForGuestController {
  constructor(
    @Inject(StoryService)
    private readonly storyService: StoryService,
  ) {}

  @ApiDescription({
    tags: 'Story(For Guest)',
    summary: '진척도 없이 스토리 목록 조회(게스트용)',
    listResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressResponse,
    },
  })
  @Get('progress')
  async getStoryProgressForGuest(): Promise<
    ResponsesListDto<StoryProgressResponse>
  > {
    return new ResponsesListDto(await this.storyService.getStoryProgress());
  }

  @ApiDescription({
    tags: 'Story(For Guest)',
    summary: '진척도 없이 구역별 스토리 목록 조회(게스트용)',
    listResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressByZoneResponse,
    },
  })
  @Get('progress/:zoneId')
  async getStoryProgressByZoneForGuest(
    @Param('zoneId', ParseIntPipe) zoneId: number,
  ): Promise<ResponsesListDto<StoryProgressByZoneResponse>> {
    return new ResponsesListDto(
      await this.storyService.getStoryProgressByZone(zoneId),
    );
  }
}
