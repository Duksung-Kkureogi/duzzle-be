import { Injectable } from '@nestjs/common';
import { StoryRepositoryService } from '../repository/service/story.repository.service';
import { StoryResponse } from './dto/story.dto';

@Injectable()
export class StoryService {
  constructor(
    private readonly storyRepositoryService: StoryRepositoryService,
  ) {}

  async getStory(seasonId: number, zoneId: number, page: number) {
    const story = await this.storyRepositoryService.getStory(
      seasonId,
      zoneId,
      page,
    );

    return StoryResponse.from(story);
  }
}
