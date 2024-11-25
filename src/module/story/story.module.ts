import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { StoryForGuestController } from './story-for-guest.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [StoryController, StoryForGuestController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
