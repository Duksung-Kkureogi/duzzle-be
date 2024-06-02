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
import { NftMetadataEntity } from './entity/nft-metadata.entity';
import { NftRepositoryService } from './service/nft.repository.service';
import { SeasonEntity } from './entity/season.entity';
import { SeasonZoneEntity } from './entity/season-zone.entity';
import { PuzzlePieceEntity } from './entity/puzzle-piece.entity';
import { PuzzleRepositoryService } from './service/puzzle.repository.service';
import { ContractEntity } from './entity/contract.entity';
import { LogTransactionEntity } from './entity/log-transaction.entity';
import { TransactionRepositoryService } from './service/transaction.repository.service';
import { MaterialItemEntity } from './entity/material-item.entity';
import { RequiredMaterialItemsEntity } from './entity/required-material-items.entity';
import { BlueprintItemEntity } from './entity/blueprint-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FaqEntity,
      QnaEntity,
      QuestEntity,
      LogQuestEntity,
      ZoneEntity,
      ContractEntity,
      NftMetadataEntity,
      SeasonEntity,
      MaterialItemEntity,
      SeasonZoneEntity,
      PuzzlePieceEntity,
      RequiredMaterialItemsEntity,
      LogTransactionEntity,
      MaterialItemEntity,
      BlueprintItemEntity,
    ]),
  ],
  providers: [
    UserRepositoryService,
    SupportRepositoryService,
    QuestRepositoryService,
    ZoneRepositoryService,
    NftRepositoryService,
    PuzzleRepositoryService,
    TransactionRepositoryService,
  ],
  exports: [
    UserRepositoryService,
    SupportRepositoryService,
    QuestRepositoryService,
    ZoneRepositoryService,
    NftRepositoryService,
    PuzzleRepositoryService,
    TransactionRepositoryService,
  ],
})
export class RepositoryModule {}
