import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepositoryService } from './service/user.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepositoryService],
  exports: [UserRepositoryService],
})
export class RepositoryModule {}
