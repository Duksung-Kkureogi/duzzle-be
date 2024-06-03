import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepositoryService } from './service/user.repository.service';
import { SupportRepositoryService } from './service/support.repository.service';
import { FaqEntity } from './entity/faq.entity';
import { QnaEntity } from './entity/qna.entity';
import { QuestRepositoryService } from './service/quest.repository.service';
import { QuestEntity } from './entity/quest.entity';
import { LogQuestEntity } from './entity/log-quest.entity';
import { ZoneEntity } from './entity/zone.entity';
import { ZoneRepositoryService } from './service/zone.repository.service';
import { NftContractEntity } from './entity/nft-contract.entity';
import { NftMetadataEntity } from './entity/nft-metadata.entity';
import { NftRepositoryService } from './service/nft.repository.service';
import { ItemEntity } from './entity/item.entity';
import { SeasonEntity } from './entity/season.entity';
import { SeasonZoneEntity } from './entity/season-zone.entity';
import { PuzzlePieceEntity } from './entity/puzzle-piece.entity';
import { PuzzleRepositoryService } from './service/puzzle.repository.service';
import { RequiredItemsEntity } from './entity/required-items.entity';
import { StoryEntity } from './entity/story.entity';
import { StoryRepositoryService } from './service/story.repository.service';
import { UserStoryEntity } from './entity/user-story.entity';
import { StoryContentEntity } from './entity/story-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FaqEntity,
      QnaEntity,
      QuestEntity,
      LogQuestEntity,
      ZoneEntity,
      NftContractEntity,
      NftMetadataEntity,
      SeasonEntity,
      ItemEntity,
      SeasonZoneEntity,
      PuzzlePieceEntity,
      RequiredItemsEntity,
      StoryEntity,
      StoryContentEntity,
      UserStoryEntity,
    ]),
  ],
  providers: [
    UserRepositoryService,
    SupportRepositoryService,
    QuestRepositoryService,
    ZoneRepositoryService,
    NftRepositoryService,
    PuzzleRepositoryService,
    StoryRepositoryService,
  ],
  exports: [
    UserRepositoryService,
    SupportRepositoryService,
    QuestRepositoryService,
    ZoneRepositoryService,
    NftRepositoryService,
    PuzzleRepositoryService,
    StoryRepositoryService,
  ],
})
export class RepositoryModule {}
