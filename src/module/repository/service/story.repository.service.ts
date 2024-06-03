import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryEntity } from '../entity/story.entity';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';
import { UserStoryEntity } from '../entity/user-story.entity';
import { InsertUserStoryDto, UpdateUserStoryDto } from '../dto/story.dto';
import { StoryContentEntity } from '../entity/story-content.entity';

@Injectable()
export class StoryRepositoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private storyRepository: Repository<StoryEntity>,

    @InjectRepository(StoryContentEntity)
    private storyContentRepository: Repository<StoryContentEntity>,

    @InjectRepository(UserStoryEntity)
    private userStoryRepository: Repository<UserStoryEntity>,
  ) {}

  async getStoryList(): Promise<StoryEntity[]> {
    const stories = await this.storyRepository.find({
      relations: ['zone'],
    });

    return stories;
  }

  async getStoryByPage(
    storyId: number,
    page: number,
  ): Promise<StoryContentEntity> {
    const story = await this.storyContentRepository.findOne({
      where: { storyId, page },
      relations: ['story'],
    });

    if (!story) {
      throw new ServiceError(ExceptionCode.NotFound);
    }

    return story;
  }

  async findUserStoryProgress(userId: number): Promise<UserStoryEntity[]> {
    const userStories = await this.userStoryRepository.find({
      where: { userId },
      relations: ['story', 'story.zone'],
    });

    return userStories;
  }

  async insertUserStoryProgress(dto: InsertUserStoryDto): Promise<void> {
    await this.userStoryRepository.insert(dto);
  }

  async updateUserStoryProgress(dto: UpdateUserStoryDto): Promise<void> {
    await this.userStoryRepository.update(
      { userId: dto.userId, storyId: dto.storyId },
      dto,
    );
  }
}
