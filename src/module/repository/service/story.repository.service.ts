import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryEntity } from '../entity/story.entity';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';

@Injectable()
export class StoryRepositoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private storyRepository: Repository<StoryEntity>,
  ) {}

  async getStory(
    seasonId: number,
    zoneId: number,
    page: number,
  ): Promise<StoryEntity> {
    const story = await this.storyRepository.findOne({
      where: { seasonId, zoneId, page },
      relations: ['season', 'zone'],
    });

    if (!story) {
      throw new ServiceError(ExceptionCode.NotFound);
    }

    return story;
  }
}
