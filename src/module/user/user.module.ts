import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudStorageModule } from '../cloudStorage/cloudStorage.module';
import { PuzzleModule } from '../puzzle/puzzle.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [RepositoryModule, CloudStorageModule, PuzzleModule, ItemModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
