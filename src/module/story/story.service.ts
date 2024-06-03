import { Injectable } from '@nestjs/common';
import { StoryRepositoryService } from '../repository/service/story.repository.service';
import {
  StoryResponse,
  UpdateUserStoryProgressRequest,
  UserStoryProgressResponse,
} from './dto/story.dto';

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

  async getUserStoryProgress(
    userId: number,
  ): Promise<UserStoryProgressResponse[]> {
    let userStories =
      await this.storyRepositoryService.findUserStoryProgress(userId);

    if (!userStories || userStories.length === 0) {
      const storyList = await this.storyRepositoryService.getStoryList();
      const storyIds = storyList.map((e) => e.id);

      for (const id of storyIds) {
        if (!userStories.some((userStory) => userStory.storyId === id)) {
          const dto = {
            userId: userId,
            storyId: id,
            readPage: 0,
          };
          await this.storyRepositoryService.insertUserStoryProgress(dto);
        }
      }
    }

    userStories.sort((a, b) => {
      if (a.story.zoneId < b.story.zoneId) return -1;
      if (a.story.zoneId > b.story.zoneId) return 1;
      return 0;
    });

    const result = userStories.map((e) => UserStoryProgressResponse.from(e));

    return result;
  }

  async updateUserStoryProgress(
    userId: number,
    params: UpdateUserStoryProgressRequest,
  ): Promise<void> {
    await this.storyRepositoryService.updateUserStoryProgress({
      ...params,
      userId: userId,
    });
  }
}
