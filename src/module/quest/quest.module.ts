import { RepositoryModule } from 'src/module/repository/repository.module';
import { Module } from '@nestjs/common';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';

@Module({
  imports: [RepositoryModule],
  controllers: [QuestController],
  providers: [QuestService],
  exports: [QuestService],
})
export class QuestModule {}
