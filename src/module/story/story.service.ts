import { Injectable } from '@nestjs/common';
import { StoryRepositoryService } from '../repository/service/story.repository.service';
import { StoryResponse } from './dto/story.dto';

@Injectable()
export class StoryService {
  constructor(
    private readonly storyRepositoryService: StoryRepositoryService,
  ) {}

  async getStoryByPage(storyId: number, page: number): Promise<StoryResponse> {
    const result = await this.storyRepositoryService.getStoryByPage(
      storyId,
      page,
    );

    return StoryResponse.from(result);
  }

  async getStoryList() {
    return this.storyRepositoryService.getStoryListForGuest();
  }
}
