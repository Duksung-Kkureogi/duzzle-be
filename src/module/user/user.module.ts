import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudStorageModule } from '../cloudStorage/cloudStorage.module';

@Module({
  imports: [RepositoryModule, CloudStorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
