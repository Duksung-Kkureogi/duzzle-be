import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { ResponseException } from 'src/decorator/response-exception.decorator';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ExceptionCode } from 'src/constant/exception';
import { StoryRequest, StoryResponse } from './dto/story.dto';

@Controller({
  path: 'story',
})
export class StoryController {
  constructor(
    @Inject(StoryService)
    private readonly storyService: StoryService,
  ) {}

  @ApiTags('Story')
  @ApiOperation({ summary: '시즌/구역별 스토리 특정 페이지 조회' })
  @ApiQuery({
    name: 'seasonId',
    type: Number,
    required: true,
    description: '시즌 ID',
  })
  @ApiQuery({
    name: 'zoneId',
    type: Number,
    required: true,
    description: '구역 ID',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: '페이지 번호',
    example: 1,
  })
  @HttpCode(HttpStatus.OK)
  @ResponseData(StoryResponse)
  @ResponseException(HttpStatus.NOT_FOUND, [ExceptionCode.NotFound])
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Get('')
  async getStory(@Query() query: StoryRequest) {
    const { seasonId, zoneId, page } = query;
    const result = await this.storyService.getStory(seasonId, zoneId, page);

    return new ResponsesDataDto(result);
  }
}
