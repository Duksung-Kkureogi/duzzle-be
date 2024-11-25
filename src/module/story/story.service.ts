import { Injectable } from '@nestjs/common';
import { StoryRepositoryService } from '../repository/service/story.repository.service';
import { StoryResponse } from './dto/story.dto';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
  UpdateUserStoryProgressRequest,
} from './dto/story-progress.dto';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';
import { InvalidParamsError } from 'src/types/error/application-exceptions/400-bad-request';

@Injectable()
export class StoryService {
  constructor(
    private readonly storyRepositoryService: StoryRepositoryService,
    private readonly zoneRepositoryService: ZoneRepositoryService,
  ) {}

  async getStoryByPage(storyId: number, page: number): Promise<StoryResponse> {
    const result = await this.storyRepositoryService.getStoryByPage(
      storyId,
      page,
    );

    return StoryResponse.from(result);
  }

  async getStoryProgress(): Promise<StoryProgressResponse[]> {
    return await this.storyRepositoryService.getStoryProgress();
  }

  async getStoryProgressByZone(
    zoneId: number,
  ): Promise<StoryProgressByZoneResponse[]> {
    const stories =
      await this.storyRepositoryService.getStoryProgressByZone(zoneId);

    return stories.map((story) => {
      return {
        storyId: story.id,
        title: story.title,
        totalPage: story.contents.length,
        readPage: 0,
      };
    });
  }

  async getUserStoryProgress(userId: number): Promise<StoryProgressResponse[]> {
    return await this.storyRepositoryService.getUserStoryProgress(userId);
  }

  async getUserStoryProgressByZone(
    userId: number,
    zoneId: number,
  ): Promise<StoryProgressByZoneResponse[]> {
    return await this.storyRepositoryService.getUserStoryProgressByZone(
      userId,
      zoneId,
    );
  }

  async updateUserStoryProgress(
    userId: number,
    params: UpdateUserStoryProgressRequest,
  ): Promise<void> {
    const totalPage = (
      await this.storyRepositoryService.getStoryById(params.storyId)
    ).length;
    if (params.readPage > totalPage) throw new InvalidParamsError();
    await this.storyRepositoryService.updateUserStoryProgress({
      ...params,
      userId,
    });
  }
}
