import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoryEntity } from '../entity/story.entity';
import { UserStoryEntity } from '../entity/user-story.entity';
import { UpdateUserStoryDto } from '../dto/story.dto';
import { StoryContentEntity } from '../entity/story-content.entity';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
} from 'src/module/story/dto/story-progress.dto';

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

  async getStoryById(storyId: number): Promise<StoryContentEntity[]> {
    const story = await this.storyContentRepository.find({
      where: { story: { id: storyId } },
    });

    if (!story || story.length === 0) {
      throw new ContentNotFoundError('story', `${storyId}`);
    }

    return story;
  }

  async getStoryByPage(
    storyId: number,
    page: number,
  ): Promise<StoryContentEntity> {
    const story = await this.storyContentRepository.findOne({
      where: {
        story: { id: storyId },
        page: page,
      },
      relations: ['story', 'story.contents'],
    });

    if (!story) {
      throw new ContentNotFoundError('story:page', `${storyId}:${page}`);
    }

    return story;
  }

  async updateUserStoryProgress(dto: UpdateUserStoryDto): Promise<void> {
    const userStory = this.userStoryRepository.create(dto);

    await this.userStoryRepository.save(userStory);
  }

  async getStoryProgress(): Promise<StoryProgressResponse[]> {
    return await this.storyRepository
      .createQueryBuilder('s')
      .select('z.id as "zoneId"')
      .addSelect('z.nameKr as "zoneNameKr"')
      .addSelect('z.nameUs as "zoneNameUs"')
      .addSelect('count(*) as "totalStory"')
      .addSelect('0 as "readStory"')
      .innerJoin('s.zone', 'z')
      .groupBy('z.id, z.nameKr, z.nameUs')
      .orderBy('z.id')
      .getRawMany();
  }

  async getStoryProgressByZone(zoneId: number): Promise<StoryEntity[]> {
    return await this.storyRepository.find({
      where: { zoneId },
      relations: ['zone', 'contents'],
      order: { storyOrder: 'ASC' },
    });
  }

  async getUserStoryProgress(userId: number): Promise<StoryProgressResponse[]> {
    return await this.storyRepository
      .createQueryBuilder('s')
      .select('z.id as "zoneId"')
      .addSelect('z.nameKr as "zoneNameKr"')
      .addSelect('z.nameUs as "zoneNameUs"')
      .addSelect('count(*) as "totalStory"')
      .addSelect(
        `
        sum(
          case
            when (
              select count(*)
              from story_content as sc
              where sc.story_id = s.id
            ) = us.read_page
            then 1
            else 0
          end
        ) as "readStory"
      `,
      )
      .innerJoin('s.zone', 'z')
      .leftJoin(
        UserStoryEntity,
        'us',
        's.id = us.storyId and us.userId = :userId',
        { userId },
      )
      .groupBy('z.id, z.nameKr, z.nameUs')
      .orderBy('z.id')
      .getRawMany();
  }

  async getUserStoryProgressByZone(
    userId: number,
    zoneId: number,
  ): Promise<StoryProgressByZoneResponse[]> {
    return await this.storyRepository
      .createQueryBuilder('s')
      .select('s.id as "storyId"')
      .addSelect('s.title as "title"')
      .addSelect('count(s.id) as "totalPage"')
      .addSelect('coalesce(us.readPage, 0) as "readPage"')
      .innerJoin('s.contents', 'sc')
      .leftJoin(
        UserStoryEntity,
        'us',
        's.id = us.storyId and us.userId = :userId',
        { userId },
      )
      .where('s.zoneId = :zoneId', { zoneId })
      .groupBy('s.id, s.title, us.readPage')
      .orderBy('s.storyOrder')
      .getRawMany();
  }
}
