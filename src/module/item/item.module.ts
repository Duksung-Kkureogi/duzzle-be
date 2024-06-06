import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
